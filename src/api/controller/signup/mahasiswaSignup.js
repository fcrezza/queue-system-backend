const bcrypt = require('bcrypt')
const passport = require('passport')

const {mahasiswaSchema} = require('../../validation')
const {addUser} = require('../../model')

function mahasiswaSignup(req, res, next) {
	mahasiswaSchema((schema) => {
		schema
			.validate(req.body)
			.then((_resp) => {
				const {fullname, prodi, gender, password, ...rest} = req.body
				const hashedPassword = bcrypt.hashSync(password, 10)

				addUser(
					{
						namaLengkap: fullname,
						idProdi: prodi,
						idGender: gender,
						password: hashedPassword,
						...rest,
					},
					(err) => {
						if (err) {
							return res
								.status(403)
								.send({message: 'uppsss, something went wrong'})
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
					},
				)
			})
			.catch((_err) => {
				res.status(403).send({message: 'uppsss, something went wrong'})
			})
	})
}

module.exports = mahasiswaSignup
