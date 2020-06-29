const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const cors = require('cors')
const expressSession = require('express-session')
const MySQLStore = require('express-mysql-session')(expressSession)
require('dotenv').config()
const {
	db,
	cancelBimbingan,
	findDosenByUsername,
	findMahasiswaByUsername,
	findDosenByID,
	findMahasiswaByID,
	updateStatusDosen,
	updateAntrianStatusByMahasiswaID,
	getAntrianByDosenID,
	requestBimbingan,
} = require('./api/model')
const dbOption = require('./api/dbOption')
const api = require('./api')

const sessionStore = new MySQLStore(dbOption, db)
const session = expressSession({
	secret: process.env.SECRETKEY,
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
})
passport.use(
	'login-dosen',
	new LocalStrategy((username, password, done) => {
		findDosenByUsername(username, (err, dosen) => {
			if (err) {
				return done(err)
			}
			if (!dosen) {
				return done(null, false, {
					message: `Tidak ada akun dengan username ${username}`,
				})
			}
			if (!bcrypt.compareSync(password, dosen.password)) {
				return done(null, false, {
					message: 'Password yang kamu masukan salah',
				})
			}
			return done(null, {
				...dosen,
				role: 'dosen',
			})
		})
	}),
)
passport.use(
	'login-mahasiswa',
	new LocalStrategy((username, password, done) => {
		findMahasiswaByUsername(username, (err, mahasiswa) => {
			if (err) {
				return done(err)
			}
			if (!mahasiswa) {
				return done(null, false, {
					message: `Tidak ada akun dengan username ${username}`,
				})
			}
			if (!bcrypt.compareSync(password, mahasiswa.password)) {
				return done(null, false, {
					message: 'Password yang kamu masukan salah',
				})
			}
			return done(null, {
				...mahasiswa,
				role: 'mahasiswa',
			})
		})
	}),
)
passport.serializeUser((user, done) => {
	done(null, {
		id: user.id,
		role: user.role,
	})
})
passport.deserializeUser(async (user, done) => {
	const {id, role} = user
	if (role === 'dosen') {
		const dosen = await findDosenByID(id)
		done(null, {
			role,
			...dosen,
		})
		return
	}

	const mahasiswa = await findMahasiswaByID(id)
	done(null, {
		role,
		...mahasiswa,
	})
})
app.use(
	cors({
		credentials: true,
		allowedHeaders: ['sessionId', 'Content-Type'],
		exposedHeaders: ['sessionId'],
		origin: 'http://localhost:3000',
	}),
)
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(session)
io.use((socket, next) => {
	session(socket.request, socket.request.res || {}, next)
})
app.use(passport.initialize())
app.use(passport.session())
app.use('/', api)

io.on('connection', (socket) => {
	let professorID = null
	// change dosen status: only for dosen
	socket.on('make-me-online', async (id) => {
		professorID = id
		await updateStatusDosen(1, professorID)
		socket.broadcast.emit('dosenStatus', {id: professorID, status: 1})
	})
	// get queue: for all user
	socket.on('getAntrian', async (id) => {
		const antrian = await getAntrianByDosenID(id)
		socket.emit('new-data', antrian, id)
	})
	// request bimbingan: only for mahasiswa
	socket.on('requestBimbingan', async ({id, professorID: profID}) => {
		await requestBimbingan(id, profID)
		const antrian = await getAntrianByDosenID(profID)
		socket.emit('new-data', antrian, profID)
		socket.broadcast.emit('new-data', antrian, profID)
	})
	// call next queue: only for dosen
	socket.on('next', async (previousActiveUser, nextUser, profID) => {
		if (previousActiveUser) {
			const {id, time} = previousActiveUser
			await updateAntrianStatusByMahasiswaID(
				id,
				time,
				'completed',
			)
		}

		if (nextUser) {
			const {id, time} = nextUser
			await updateAntrianStatusByMahasiswaID(id, time, 'active')
		}

		const antrian = await getAntrianByDosenID(profID)
		socket.emit('new-data', antrian, profID)
		socket.broadcast.emit('new-data', antrian, profID)
	})
	// out from antrian
	socket.on('out', async ({time, id, profID}) => {
		await cancelBimbingan(time, id, profID)
		const antrian = await getAntrianByDosenID(profID)
		socket.emit('new-data', antrian, profID)
		socket.broadcast.emit('new-data', antrian, profID)
	})
	// disconnect user 'aka' change status dosen: only for dosenn
	socket.on('disconnect', async () => {
		if (professorID) {
			await updateStatusDosen(0, professorID)
			socket.broadcast.emit('dosenStatus', {id: professorID, status: 0})
		}
	})
})

http.listen(process.env.PORT, () => {
	console.log(`server listen at port ${process.env.PORT}`)
})
