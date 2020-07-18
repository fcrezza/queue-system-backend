const router = require('express').Router()
const {
	changeProfessorProfile,
	fetchProfessorByID,
	fetchProfessorsUsername,
	fetchProfessorsNIP,
	changeProfessorPassword,
	fetchStudentsByProfessorID
} = require('../controller/professor')

router.get('/professors/:id', fetchProfessorByID)
router.post('/professors/:id', changeProfessorProfile)
router.get('/professors/:id/students', fetchStudentsByProfessorID)
router.get('/professors/username/:username', fetchProfessorsUsername)
router.get('/professors/nip/:nip', fetchProfessorsNIP)
router.post('/professors/:id/password', changeProfessorPassword)

module.exports = router