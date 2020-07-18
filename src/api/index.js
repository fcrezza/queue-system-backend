const router = require('express').Router()
const student = require('./routes/student')
const professor = require('./routes/professor')
const common = require('./routes/common')

router.use(student)
router.use(professor)
router.use(common)

module.exports = router