const sql = require('mysql')

const dbOption = require('./dbOption')

const db = sql.createConnection(dbOption)

function findDosenByUsername(username, callback) {
	db.query(
		'select id, username, password from dosen where username = ?',
		username,
		(err, results) => {
			callback(err, results[0])
		},
	)
}

function findMahasiswaByUsername(username, callback) {
	db.query(
		'select id, username, password from mahasiswa where username = ?',
		username,
		(err, results) => {
			callback(err, results[0])
		},
	)
}

function findDosenByID(id, callback) {
	db.query('select * from dosen where id = ?', id, (err, results) => {
		if (err) throw err
		callback(results[0])
	})
}

function findMahasiswaByID(id, callback) {
	db.query('select * from mahasiswa where id = ?', id, (err, results) => {
		if (err) throw err
		callback(results[0])
	})
}

function getGenders(callback) {
	db.query('select * from gender', (err, results) => {
		callback(err, results)
	})
}

function getProdi(callback) {
	db.query('select * from prodi', (err, results) => {
		callback(err, results)
	})
}

function getFakultas(callback) {
	db.query('select * from fakultas', (err, results) => {
		callback(err, results)
	})
}

function getDosenByProdiID(prodiID, callback) {
	db.query('SELECT dosen.id, dosen.namaLengkap, dosen.avatar, fakultas.nama as fakultas from dosen left join fakultas on dosen.idFakultas = fakultas.id left join prodi on fakultas.id = prodi.idFakultas where prodi.id = ? GROUP by dosen.id', prodiID, (err, results) => {
		callback(err, results)
	})
}

module.exports = {
	db,
	findDosenByID,
	findMahasiswaByID,
	findDosenByUsername,
	findMahasiswaByUsername,
	getDosenByProdiID,
	getGenders,
	getProdi,
	getFakultas,
}
