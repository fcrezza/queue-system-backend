const router = require('express').Router()
const {
	changePassword,
	changeMahasiswaProfile,
	changeDosenProfile,
} = require('../../controller/modifyData')

router.post('/changePassword', changePassword)
router.post('/changeMahasiswaProfile', changeMahasiswaProfile)
router.post('/changeDosenProfile', changeDosenProfile)

module.exports = router
