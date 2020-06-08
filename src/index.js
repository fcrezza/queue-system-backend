const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const cors = require('cors')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
require('dotenv').config()

const {
	db,
	addUser,
	checkUserByUsername,
	findDosenByUsername,
	findMahasiswaByUsername,
	findDosenByID,
	findMahasiswaByID,
	getDosenByProdiID,
	checkUserByIDNumber,
	getGenders,
	getProdi,
	getFakultas,
} = require('./db')
const {dosenSchema, mahasiswaSchema} = require('./validation')
const dbOption = require('./dbOption')

const app = express()
const sessionStore = new MySQLStore(dbOption, db)

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

passport.deserializeUser((user, done) => {
	if (user.role === 'dosen') {
		findDosenByID(user.id, (dosen) => {
			done(null, {
				...dosen,
				role: user.role,
			})
		})
		return
	}

	findMahasiswaByID(user.id, (mahasiswa) => {
		done(null, {
			...mahasiswa,
			role: user.role,
		})
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
app.use(
	session({
		secret: process.env.SECRETKEY,
		store: sessionStore,
		resave: false,
		saveUninitialized: true,
	}),
)
app.use(passport.initialize())
app.use(passport.session())

app.post('/login/:role', (req, res, next) => {
	passport.authenticate(`login-${req.params.role}`, (err, user, info) => {
		if (info) {
			return res.status(403).send(info)
		}

		if (err) {
			return next(err)
		}

		req.login(user, (error) => {
			if (error) {
				return next(error)
			}
			return res.end()
		})
	})(req, res, next)
})

app.post('/signup', async (req, res, next) => {
	if (req.body.role === 'dosen') {
		dosenSchema((schema) => {
			schema.validate(req.body).then((_resp) => {
				const {fullname, fakultas, gender, password, ...rest} = req.body
				const hashedPassword = bcrypt.hashSync(password, 10)
				addUser({
					namaLengkap: fullname,
					idFakultas: fakultas,
					idGender: gender,
					password: hashedPassword,
					...rest
				}, (err) => {
					if (err) {
						return res.status(403).send({message: 'uppsss, something went wrong'})
					}

					passport.authenticate(`login-dosen`, (er, user, info) => {
						if (info) {
							return res.status(403).send(info)
						}

						if (er) {
							return next(err)
						}

						req.login(user, (error) => {
							if (error) {
								return next(error)
							}
							return res.end()
						})
					})(req, res, next)
				})
			}).catch((_err) => {
				res.status(403).send({message: 'uppsss, something went wrong'})
			})
		})
		} else {
			mahasiswaSchema((schema) => {
			schema.validate(req.body).then((_resp) => {
				const {fullname, prodi, gender, password, ...rest} = req.body
				const hashedPassword = bcrypt.hashSync(password, 10)

				addUser({
					namaLengkap: fullname,
					idProdi: prodi,
					idGender: gender,
					password: hashedPassword,
					...rest
				}, (err) => {
					if (err) {
						return res.status(403).send({message: 'uppsss, something went wrong'})
					}

					passport.authenticate(`login-mahasiswa`, (er, user, info) => {
						if (info) {
							return res.status(403).send(info)
						}

						if (er) {
							return next(err)
						}

						req.login(user, (error) => {
							if (error) {
								return next(error)
							}
							return res.end()
						})
					})(req, res, next)
				})
			}).catch((_err) => {
				res.status(403).send({message: 'uppsss, something went wrong'})
			})
		})
		}
})

app.get('/logout', (req, res, next) => {
	req.logout()
	req.session.destroy((err) => {
		if (err) {
			return next(err)
		}

		res.clearCookie('connect.sid', {path: '/'})
		return res.end()
	})
})

app.get('/getUser', (req, res) => {
	if (req.isAuthenticated()) {
		return res.send(req.user)
	}
	return res.json(null)
})

app.get('/genders', (req, res) => {
	getGenders((err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	})
})

app.get('/prodi', (req, res) => {
	getProdi((err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	})
})

app.get('/fakultas', (req, res) => {
	getFakultas((err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	})
})

app.get('/dosen/:prodiID', (req, res) => {
	getDosenByProdiID(req.params.prodiID, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	})
})

app.post('/checkUsername', (req, res) => {
	checkUserByUsername(req.body.role, req.body.username, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		if (result.length) {
			return res.status(502).send({
				message: `Sudah ada ${req.body.role} yang menggunakan username ini`,
			})
		}

		return res.end()
	})
})

app.post('/checkUserById', (req, res) => {
	checkUserByIDNumber(req.body.role, req.body.id, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		if (result.length) {
		return res.status(502).send({
				message: `Sudah ada ${req.body.role} yang menggunakan ${
					Object.keys(result[0])[0]
				} ini`,
			})
		}

		return res.end()
	})
})

app.listen(process.env.PORT, () => {
	console.log(`server listen at port ${process.env.PORT}`)
})
