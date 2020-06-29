const router = require('express').Router()
const {
	fetchFakultas,
	fetchFakultasByID,
	fetchGenders,
	fetchProdi,
	fetchUser,
	fetchProdiByID,
	fetchDosenByID,
	getDosenByProdi,
	fetchAntrianByDosenID,
	fetchGenderByID,
	fetchDosenInfoByID,
	fetchMahasiswaProfile,
	fetchMahasiswaByID,
	fetchListMahasiswaByDosenID
} = require('../../controller/getData')

router.get('/getUser', fetchUser)
router.get('/genders', fetchGenders)
router.get('/prodi', fetchProdi)
// router.get('/prodi/:id', fetchProdiByID)
router.get('/fakultas', fetchFakultas)
// router.get('/fakultas/:id', fetchFakultasByID)
router.get('/dosen/:prodiID', getDosenByProdi)
router.get('/getDosen/:id', fetchDosenByID)
// router.get('/gender/:id', fetchGenderByID)
router.get('/antrian/:dosenID', fetchAntrianByDosenID)
router.get('/dosenInfo/:id', fetchDosenInfoByID)
router.get('/listMahasiswa/:id', fetchListMahasiswaByDosenID)
router.get('/mahasiswa/:id', fetchMahasiswaByID)

module.exports = router
