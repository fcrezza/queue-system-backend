const professorSignup = require('./professorSignup')
const studentSignup = require('./studentSignup')

function signup(req, res, next) {
	if (req.body.role === 'professor') {
		professorSignup(req, res, next)
	} else {
		studentSignup(req, res, next)
	}
}

module.exports = signup
