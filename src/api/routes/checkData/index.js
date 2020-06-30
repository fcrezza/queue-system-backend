const router = require('express').Router()
const {
	checkUsername,
	checkUserByIdentity,
} = require('../../controller/checkData')
// use this
router.post('/checkUsername', checkUsername)
// use this
router.post('/checkUserByIdentity', checkUserByIdentity)

module.exports = router
