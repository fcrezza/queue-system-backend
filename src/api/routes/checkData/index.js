const router = require('express').Router()

const {checkUsername, checkUserByID} = require('../../controller/checkData')

router.post('/checkUsername', checkUsername)
router.post('/checkUserById', checkUserByID)

module.exports = router