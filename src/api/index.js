const router = require('express').Router()

const login = require('./routes/login')
const signup = require('./routes/signup')
const logout = require('./routes/logout')
const checkData = require('./routes/checkData')
const getData = require('./routes/getData')
const modifyData = require('./routes/modifyData')

router.use(checkData)
router.use(modifyData)
router.use(getData)
router.use(login)
router.use(signup)
router.use(logout)

module.exports = router