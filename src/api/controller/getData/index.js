const {
	getProdi,
	getDosenByProdiID,
	getGenders,
	getFakultas,
	getFakultasByID,
	getProdiByID,
	findDosenByID,
	getAntrianByDosenID,
	getGenderByID,
	getDosenInfoByID,
	getListMahasiswa,
	getMahasiswaByID
} = require('../../model')

function fetchUser(req, res) {
	if (req.isAuthenticated()) {
		return res.send(req.user)
	}

	return res.json(null)
}

function fetchGenders(req, res) {
	getGenders((err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	})
}

function fetchProdi(req, res) {
	getProdi((err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	})
}

function fetchFakultas(req, res) {
	getFakultas((err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	})
}

function getDosenByProdi(req, res) {
	getDosenByProdiID(req.params.prodiID, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	})
}

function fetchProdiByID(req, res) {
	getProdiByID(req.params.id, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upps, ada yang salah'})
		}

		return res.send(result)
	}) 	
}

async function fetchDosenByID(req, res, next) {
	try {
		const dosenData = await findDosenByID(req.params.id)
		res.json(dosenData)
	} catch(error) {
		next(error)
	}
}

function fetchFakultasByID(req, res) {
	getFakultasByID(req.params.id, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upps, ada yang salah'})
		}

		return res.send(result)
	}) 	
}

function fetchAntrianByDosenID(req, res) {
	getAntrianByDosenID(req.params.dosenID, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		return res.send(result)
	}) 
}

function fetchGenderByID(req, res) {
	getGenderByID(req.params.id, (err, result) => {
		if (err) {
			return res.status(502).json({message: 'upss, ada yang salah'})
		}

		return res.json(result[0])
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

async function fetchListMahasiswaByDosenID(req, res, next) {
	try {
		const listMahasiswa = await getListMahasiswa(req.params.id)
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
	fetchFakultas,
	fetchFakultasByID,
	fetchProdi,
	fetchProdiByID,
	fetchGenders,
	fetchUser,
	fetchDosenByID,
	getDosenByProdi,
	fetchAntrianByDosenID,
	fetchGenderByID,
	fetchDosenInfoByID,
	fetchListMahasiswaByDosenID,
	fetchMahasiswaByID
}
