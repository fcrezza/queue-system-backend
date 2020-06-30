const {
	getStudyPrograms,
	getProfessorsByStudyID,
	getGenders,
	getFaculties,
	findProfessorByID,
	getAntrianByDosenID,
	getDosenInfoByID,
	getListStudentsByProfessorID,
	getMahasiswaByID
} = require('../../model')

function fetchUser(req, res) {
	if (req.isAuthenticated()) {
		return res.json(req.user)
	}

	return res.json(null)
}

async function fetchGenders(req, res) {
	try {
		const genders = await getGenders()
		res.json(genders)
	} catch(error) {
		res.status(502).send({message: 'upss, ada yang salah'})
	}
}

async function fetchStudyPrograms(req, res) {
	try {
		const studyPrograms = await getStudyPrograms()
		res.json(studyPrograms)
	} catch(error) {
		res.status(502).send({message: 'upss, ada yang salah'})
	}
}

async function fetchFaculties(req, res) {
	try {
		const faculties = await getFaculties()
		res.json(faculties)
	} catch(error) {
		res.status(502).send({message: 'upss, ada yang salah'})
	}
}

async function fetchProfessorsByStudyID(req, res) {
	try {
		const professors = await getProfessorsByStudyID(req.params.prodiID)
		res.json(professors)	
	} catch(error) {
		res.status(502).send({message: 'upss, ada yang salah'})
	}
}


async function fetchProfessorByID(req, res, next) {
	try {
		const dosenData = await findProfessorByID(req.params.id)
		res.json(dosenData)
	} catch(error) {
		next(error)
	}
}


function fetchAntrianByDosenID(req, res) {
	getAntrianByDosenID(req.params.dosenID, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	}) 
}


function fetchDosenInfoByID(req, res) {
	getDosenInfoByID(req.params.id, (err, result) => {
		if (err) {
			return res.status(502).json({message: 'upss, ada yang salah'})
		}

		return res.json(result[0])
	})
}

async function fetchListStudentsByProfessorID(req, res, next) {
	try {
		const listMahasiswa = await getListStudentsByProfessorID(req.params.professorID)
		res.json(listMahasiswa)
	} catch(error) {
		next(error)
	}
}

async function fetchMahasiswaByID(req, res, next) {
	try {
		const dataMahasiswa = await getMahasiswaByID(req.params.id)
		res.json(dataMahasiswa)
	} catch(error) {
		next(error)
	}
}

module.exports = {
	fetchFaculties,
	fetchStudyPrograms,
	fetchGenders,
	fetchUser,
	fetchProfessorByID,
	fetchProfessorsByStudyID,
	fetchAntrianByDosenID,
	fetchDosenInfoByID,
	fetchListStudentsByProfessorID,
	fetchMahasiswaByID
}
