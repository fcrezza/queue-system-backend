const router = require('express').Router()
const {
	fetchFaculties,
	fetchGenders,
	fetchStudyPrograms,
	fetchUser,
	fetchProfessorByID,
	fetchProfessorsByStudyID,
	fetchAntrianByDosenID,
	fetchDosenInfoByID,
	fetchMahasiswaByID,
	fetchListStudentsByProfessorID
} = require('../../controller/getData')

router.get('/getUser', fetchUser)
router.get('/genders', fetchGenders)
router.get('/studyPrograms', fetchStudyPrograms)
router.get('/faculties', fetchFaculties)
router.get('/professorsByStudyProgram/:prodiID', fetchProfessorsByStudyID)
router.get('/professor/:id', fetchProfessorByID)
router.get('/antrian/:dosenID', fetchAntrianByDosenID)
router.get('/dosenInfo/:id', fetchDosenInfoByID)
router.get('/listStudents/:professorID', fetchListStudentsByProfessorID)
router.get('/mahasiswa/:id', fetchMahasiswaByID)

module.exports = router
