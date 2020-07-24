const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const passport = require('passport')
const bcrypt = require('bcrypt')
const cors = require('cors')
const morgan = require('morgan')
const expressSession = require('express-session')
const ExpressMysqlSession = require('express-mysql-session')
const {Strategy: LocalStrategy} = require('passport-local')
const {connection} = require('./api/store')
const connectionOption = require('./api/store/connectionOption')
const {findStudentByUsername, findStudentByID} = require('./api/model/student')
const {
	findProfessorByUsername,
	updateProfessorStatus,
	findProfessorByID,
} = require('./api/model/professor')
const {
	getQueueByProfessorID,
	requestQueue,
	updateQueueStatusByStudentID,
	cancelQueue,
} = require('./api/model/common')
const api = require('./api')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
ExpressMysqlSession(expressSession)
const sessionStore = new ExpressMysqlSession(connectionOption, connection)
const session = expressSession({
	// This is the secret used to sign the session ID cookie, use env if available
	secret: process.env.SECRETKEY || 'a9bb2391-b347-47d0-97ac-caad0457d503',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000,
	},
})

		// sameSite: 'none',
		// secure: process.env.NODE_ENV === 'production',
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
					message: 'Password yang dimasukan tidak cocok',
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
	const {id, role} = user
	done(null, {id, role})
})

passport.deserializeUser(async (user, done) => {
	const {id, role} = user
	let data
	if (role === 'professor') {
		const professor = await findProfessorByID(id)
		data = {role, ...professor}
		done(null, data)
		return
	}

	const student = await findStudentByID(id)
	data = {role, ...student}
	done(null, data)
})

app.use(
	cors({
		credentials: true,
		allowedHeaders: ['sessionId', 'Content-Type'],
		exposedHeaders: ['sessionId'],
		// Configures the Access-Control-Allow-Origin CORS header, use env if available
		origin: process.env.ORIGIN || 'http://localhost:3000',
	}),
)
morgan.token('sessionid', (req) => {
	if (req.sessionID) {
		return req.sessionID
	}

	return ''
})
morgan.token('user', (req) => {
	if (req.session) {
		return req.session.user
	}

	return ''
})
app.use(
	morgan(
		':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :user :sessionid',
	),
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
	socket.on('getQueue', async (id) => {
		const antrian = await getQueueByProfessorID(id)
		socket.emit('newData', antrian, id)
	})

	socket.on('requestQueue', async ({id, professorID: profID}) => {
		await requestQueue(id, profID)
		const antrian = await getQueueByProfessorID(profID)
		socket.emit('newData', antrian, profID)
		socket.broadcast.emit('newData', antrian, profID)
	})

	socket.on('outFromQueue', async ({time, id, professorID: profID}) => {
		await cancelQueue(time, id, profID)
		const antrian = await getQueueByProfessorID(profID)
		socket.emit('newData', antrian, profID)
		socket.broadcast.emit('newData', antrian, profID)
	})

	socket.on('makeMeOnline', async () => {
		const {passport: passportSession} = socket.request.session
		await updateProfessorStatus(1, passportSession.user.id)
		socket.broadcast.emit('professorStatus', {
			id: passportSession.user.id,
			status: 1,
		})
	})

	socket.on('nextQueue', async (previousActiveUser, nextUser) => {
		const {passport: passportSession} = socket.request.session

		if (previousActiveUser) {
			const {id, time} = previousActiveUser
			await updateQueueStatusByStudentID(id, time, 'completed')
		}

		if (nextUser) {
			const {id, time} = nextUser
			await updateQueueStatusByStudentID(id, time, 'active')
		}

		const antrian = await getQueueByProfessorID(passportSession.user.id)
		socket.emit('newData', antrian, passportSession.user.id)
		socket.broadcast.emit('newData', antrian, passportSession.user.id)
	})

	socket.on('disconnect', async () => {
		const {passport: passportSession} = socket.request.session
		const isProfessor = passportSession.user.role === 'professor'
		if (isProfessor) {
			await updateProfessorStatus(0, passportSession.user.id)
			socket.broadcast.emit('professorStatus', {
				id: passportSession.user.id,
				status: 0,
			})
		}
	})
})

const port = process.env.PORT || 4000

server.listen(port, () => {
	console.log(`server listen on port ${port}`)
})
