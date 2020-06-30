const bcrypt = require('bcrypt')
const passport = require('passport')
const {studentSchema} = require('../../validation')
const {registerUser} = require('../../model')

async function studentSignup(req, res, next) {
	try {
		const schema = await studentSchema()
		const validateInput = await schema.validate(req.body)
		const {fullname, study, address, gender, password, ...rest} = validateInput
		const hashedPassword = await bcrypt.hash(password, 10)
		await registerUser({
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
		res.status(403).send({message: 'uppsss, coba lagi nanti'})
	}
}

module.exports = studentSignup
