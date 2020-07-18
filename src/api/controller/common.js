const passport = require('passport')
const bcrypt = require('bcrypt')
const professorSchema = require('../validation/professorSchema')
const studentSchema = require('../validation/studentSchema')
const {
	getFaculties,
	getGenders,
	getStudyPrograms,
	getQueueByProfessorID,
	getProfessorsByStudyProgram,
	signup: register
} = require('../model/common')

function signup(req, res, next) {
	if (req.body.role === 'professor') {
		professorSignup(req, res, next)
	} else {
		studentSignup(req, res, next)
	}
}

async function professorSignup(req, res, next) {
	try {
		const schema = await professorSchema({type: 'signup'})
		const validateInput = await schema.validate(req.body)
		const {
			fullname,
			faculty,
			address,
			gender,
			password,
			...rest
		} = validateInput
		const hashedPassword = await bcrypt.hash(password, 10)
		await register({
			namaLengkap: fullname,
			idFakultas: faculty,
			idGender: gender,
			alamat: address,
			password: hashedPassword,
			...rest,
		})
		passport.authenticate(`professorLogin`, (error, user, info) => {
			if (info) {
				res.status(403).send(info)
				return
			}

			if (error) {
				next(error)
				return
			}

			req.login(user, (err) => {
				if (err) {
					return next(err)
				}
				return res.end()
			})
		})(req, res, next)
	} catch (error) {
		next(error)
	}
}

async function studentSignup(req, res, next) {
	try {
		const schema = await studentSchema({type: 'signup'})
		const validateInput = await schema.validate(req.body)
		const {fullname, study, address, gender, password, ...rest} = validateInput
		const hashedPassword = await bcrypt.hash(password, 10)
		await register({
			namaLengkap: fullname,
			idProdi: study,
			idGender: gender,
			alamat: address,
			password: hashedPassword,
			...rest,
		})
		passport.authenticate(`studentLogin`, (error, user, info) => {
			if (info) {
				res.status(403).send(info)
				return
			}

			if (error) {
				next(error)
				return
			}

			req.login(user, (err) => {
				if (err) {
					return next(err)
				}
				return res.end()
			})
		})(req, res, next)
	} catch (error) {
		next(error)
	}
}

function login(req, res, next) {
	const authType =
		req.body.role === 'student' ? 'studentLogin' : 'professorLogin'

	passport.authenticate(authType, (err, user, info) => {
		if (info) {
			res.status(403).send(info)
			return
		}

		if (err) {
			next(err)
			return
		}

		req.login(user, (error) => {
			if (error) {
				return next(error)
			}
			
			return res.end()
		})
	})(req, res, next)
}

function logout(req, res, next) {
	req.logout()
	req.session.destroy((error) => {
		if (error) {
			next(error)
			return
		}

		res.clearCookie('connect.sid', {path: '/'})
		res.end()
	})
}

function fetchUser(req, res) {
	if (req.isAuthenticated()) {
		return res.json(req.user)
	}

	return res.json(null)
}

async function fetchGenders(req, res, next) {
	try {
		const genders = await getGenders()
		res.json(genders)
	} catch (error) {
		next(error)
	}
}

async function fetchStudyPrograms(req, res, next) {
	try {
		const studyPrograms = await getStudyPrograms()
		res.json(studyPrograms)
	} catch (error) {
		next(error)
	}
}

async function fetchFaculties(req, res, next) {
	try {
		const faculties = await getFaculties()
		res.json(faculties)
	} catch (error) {
		next(error)
	}
}

async function fetchQueueByProfessorID(req, res) {
	const {professorID} = req.params
	try {
		const queue = await getQueueByProfessorID(professorID)
		res.send(queue)
	} catch (error) {
		res.status(502).send({message: 'upss, ada yang salah'})
	}
}

async function fetchProfessorsByStudyProgram(req, res, next) {
	try {
		const professors = await getProfessorsByStudyProgram(req.params.id)
		res.json(professors)
	} catch (error) {
		next(error)
	}
}


module.exports = {
	fetchFaculties,
	fetchGenders,
	fetchUser,
	fetchStudyPrograms,
	fetchQueueByProfessorID,
	fetchProfessorsByStudyProgram,
	signup,
	login,
	logout,
}
