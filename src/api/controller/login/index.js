const passport = require('passport')

function login(req, res, next) {
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
}

module.exports = login
