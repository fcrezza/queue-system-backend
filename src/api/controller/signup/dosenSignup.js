const passport = require('passport')
const bcrypt = require('bcrypt')

const {addUser} = require('../../model')
const {dosenSchema} = require('../../validation')

function dosenSignup(req, res, next) {
	dosenSchema((schema) => {
		schema
			.validate(req.body)
			.then((_resp) => {
				const {fullname, fakultas, gender, password, ...rest} = req.body
				const hashedPassword = bcrypt.hashSync(password, 10)
				addUser(
					{
						namaLengkap: fullname,
						idFakultas: fakultas,
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
					},
				)
			})
			.catch((_err) => {
				res.status(403).send({message: 'uppsss, something went wrong'})
			})
	})
}

module.exports = dosenSignup
