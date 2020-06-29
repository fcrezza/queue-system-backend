const router = require('express').Router()
const signup = require('../../controller/signup')

router.post('/signup', signup)

module.exports = router