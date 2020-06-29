const router = require('express').Router()

const logout = require('../../controller/logout')

router.get('/logout', logout)

module.exports = router
