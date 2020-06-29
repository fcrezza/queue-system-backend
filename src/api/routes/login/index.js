const router = require('express').Router()
const login = require('../../controller/login')

router.post('/login/:role', login)

module.exports = router

