const passport = require('passport')

function login(req, res, next) {
	passport.authenticate(`${req.params.role}Login`, (err, user, info) => {
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
}

module.exports = login
