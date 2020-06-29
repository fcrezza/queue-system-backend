const dosenSignup = require('./dosenSignup')
const mahasiswaSignup = require('./mahasiswaSignup')

function signup(req, res, next) {
	if (req.body.role === 'dosen') {
		dosenSignup(req, res, next)
	} else {
		mahasiswaSignup(req, res, next)
	}
}

module.exports = signup
