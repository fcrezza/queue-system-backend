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
	findProfessorByUsername,
	findStudentByUsername,
	findProfessorByID,
	findStudentByID,
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
	'professorLogin',
	new LocalStrategy(async (username, password, done) => {
		try {
			const professor = await findProfessorByUsername(username)
			if (!professor) {
				done(null, false, {
					message: `Tidak ada akun dengan username ${username}`,
				})
				return
			}

			const matchPassword = await bcrypt.compare(password, professor.password)
			if (!matchPassword) {
				done(null, false, {
					message: 'Password yang kamu masukan salah',
				})
				return
			}

			done(null, {
				...professor,
				role: 'professor',
			})
		} catch (error) {
			done(error)
		}
	}),
)
passport.use(
	'studentLogin',
	new LocalStrategy(async (username, password, done) => {
		try {
			const student = await findStudentByUsername(username)
			if (!student) {
				done(null, false, {
					message: `Tidak ada akun dengan username ${username}`,
				})
				return
			}

			const matchPassword = await bcrypt.compare(password, student.password)
			if (!matchPassword) {
				done(null, false, {
					message: 'Password yang kamu masukan salah',
				})
				return
			}

			done(null, {
				...student,
				role: 'student',
			})
		} catch (error) {
			done(error)
		}
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
	if (role === 'professor') {
		const professor = await findProfessorByID(id)
		done(null, {
			role,
			...professor,
		})
		return
	}

	const student = await findStudentByID(id)
	done(null, {
		role,
		...student,
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
	socket.on('makeMeOnline', async (id) => {
		professorID = id
		await updateStatusDosen(1, professorID)
		socket.broadcast.emit('professorStatus', {id: professorID, status: 1})
	})
	// get queue: for all user
	socket.on('getQueue', async (id) => {
		const antrian = await getAntrianByDosenID(id)
		socket.emit('newData', antrian, id)
	})
	// request bimbingan: only for mahasiswa
	socket.on('requestQueue', async ({id, professorID: profID}) => {
		await requestBimbingan(id, profID)
		const antrian = await getAntrianByDosenID(profID)
		socket.emit('newData', antrian, profID)
		socket.broadcast.emit('newData', antrian, profID)
	})
	// call next queue: only for dosen
	socket.on('nextQueue', async (previousActiveUser, nextUser, profID) => {
		if (previousActiveUser) {
			const {id, time} = previousActiveUser
			await updateAntrianStatusByMahasiswaID(id, time, 'completed')
		}

		if (nextUser) {
			const {id, time} = nextUser
			await updateAntrianStatusByMahasiswaID(id, time, 'active')
		}

		const antrian = await getAntrianByDosenID(profID)
		socket.emit('newData', antrian, profID)
		socket.broadcast.emit('newData', antrian, profID)
	})
	// out from antrian
	socket.on('outFromQueue', async ({time, id, professorID: profID}) => {
		await cancelBimbingan(time, id, professorID)
		const antrian = await getAntrianByDosenID(profID)
		socket.emit('newData', antrian, profID)
		socket.broadcast.emit('newData', antrian, profID)
	})
	// disconnect user 'aka' change status dosen: only for dosenn
	socket.on('disconnect', async () => {
		if (professorID) {
			await updateStatusDosen(0, professorID)
			socket.broadcast.emit('professorStatus', {id: professorID, status: 0})
		}
	})
})

http.listen(process.env.PORT, () => {
	console.log(`server listen at port ${process.env.PORT}`)
})
