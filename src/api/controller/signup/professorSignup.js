const passport = require('passport')
const bcrypt = require('bcrypt')
const {registerUser} = require('../../model')
const {professorSchema} = require('../../validation')

async function professorSignup(req, res, next) {
	try {
		const schema = await professorSchema()
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
		await registerUser({
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
		res.status(403).send({message: 'uppsss, coba lagi nanti'})
	}
}

module.exports = professorSignup
