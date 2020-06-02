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

module.exports = {
	db,
	findDosenByID,
	findMahasiswaByID,
	findDosenByUsername,
	findMahasiswaByUsername,
}
