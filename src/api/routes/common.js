const router = require('express').Router()
const {
	signup,
	login,
	logout,
	fetchFaculties,
	fetchGenders,
	fetchStudyPrograms,
	fetchUser,
	fetchQueueByProfessorID,
	fetchProfessorsByStudyProgram,
} = require('../controller/common')

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.get('/genders', fetchGenders)
router.get('/faculties', fetchFaculties)
router.get('/user', fetchUser)
router.get('/studyPrograms', fetchStudyPrograms)
router.get('/studyPrograms/:id/professors', fetchProfessorsByStudyProgram)

module.exports = router
