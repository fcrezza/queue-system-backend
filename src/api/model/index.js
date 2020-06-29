const mysql = require('mysql')
const dbOption = require('../dbOption')

const db = mysql.createConnection(dbOption)
//use this
function findDosenByUsername(username, callback) {
	db.query(
		'select id, username, password from dosen where username = ?',
		username,
		(err, results) => {
			callback(err, results[0])
		},
	)
}
// use this
function findMahasiswaByUsername(username, callback) {
	db.query(
		'select id, username, password from mahasiswa where username = ?',
		username,
		(err, results) => {
			callback(err, results[0])
		},
	)
}
// use this
function findDosenByID(id) {
	let query =
		'select dosen.id, dosen.namaLengkap fullname, dosen.nip,dosen.username,dosen.alamat as address,dosen.avatar,dosen.status,fakultas.id as facultyID,fakultas.nama as facultyName,gender.id genderID,gender.nama genderName from dosen left join fakultas on dosen.idFakultas=fakultas.id left join gender on gender.id=dosen.idGender where dosen.id = ?'
	query = mysql.format(query, [id])

	return new Promise((resolve, reject) => {
		db.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			const {
				facultyName,
				facultyID,
				genderID,
				genderName,
				...props
			} = results[0]
			const data = {
				faculty: {
					id: facultyID,
					name: facultyName,
				},
				gender: {
					id: genderID,
					name: genderName,
				},
				...props,
			}
			resolve(data)
		})
	})
}
// use this
function findMahasiswaByID(id) {
	let query =
		'select mahasiswa.id, mahasiswa.namaLengkap as fullname, mahasiswa.nim,mahasiswa.username,mahasiswa.alamat as address,mahasiswa.avatar,mahasiswa.semester, prodi.id as studyID,prodi.nama as studyName,gender.id as genderID,gender.nama as genderName, mahasiswa.idDosen as professorID from mahasiswa left join prodi on mahasiswa.idProdi=prodi.id left join gender on gender.id=mahasiswa.idGender where mahasiswa.id = ?'
	query = mysql.format(query, id)

	return new Promise((resolve, reject) => {
		db.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			const {studyName, studyID, genderID, genderName, ...props} = results[0]
			const data = {
				study: {
					id: studyID,
					name: studyName,
				},
				gender: {
					id: genderID,
					name: genderName,
				},
				...props,
			}
			resolve(data)
		})
	})
}
// use this
function getGenders(callback) {
	db.query('select * from gender', (err, results) => {
		callback(err, results)
	})
}
// use this
function getProdi(callback) {
	db.query('select * from prodi', (err, results) => {
		callback(err, results)
	})
}
// use this
function getFakultas(callback) {
	db.query('select * from fakultas', (err, results) => {
		callback(err, results)
	})
}
// use this
function getDosenByProdiID(prodiID, callback) {
	db.query(
		'SELECT dosen.id, dosen.namaLengkap, dosen.avatar, fakultas.nama as fakultas from dosen left join fakultas on dosen.idFakultas = fakultas.id left join prodi on fakultas.id = prodi.idFakultas where prodi.id = ? GROUP by dosen.id',
		prodiID,
		(err, results) => {
			callback(err, results)
		},
	)
}

function checkUserByUsername(role, username, callback) {
	if (role === 'mahasiswa') {
		db.query(
			'select username from mahasiswa where username = ?',
			username,
			(err, results) => {
				callback(err, results)
			},
		)
	} else {
		db.query(
			'select username from dosen where username = ?',
			username,
			(err, results) => {
				callback(err, results)
			},
		)
	}
}

function checkUserByIDNumber(role, id, callback) {
	if (role === 'mahasiswa') {
		db.query('select nim from mahasiswa where nim = ?', id, (err, results) => {
			callback(err, results)
		})
	} else {
		db.query('select nip from dosen where nip = ?', id, (err, results) => {
			callback(err, results)
		})
	}
}

function addUser(formData, callback) {
	const {role, ...data} = formData
	if (formData.role === 'dosen') {
		db.query('insert into dosen set ?', data, (error, results, _fields) => {
			callback(error)
		})
	} else {
		db.query('insert into mahasiswa set ?', data, (error, results, _fields) => {
			callback(error, results)
		})
	}
}

function getProdiByID(id, callback) {
	db.query(
		'select nama from prodi where id = ?',
		id,
		(err, results, _fields) => {
			callback(err, results[0])
		},
	)
}

function getFakultasByID(id, callback) {
	db.query(
		'select nama from fakultas where id = ?',
		id,
		(err, results, _fields) => {
			callback(err, results[0])
		},
	)
}

function updateStatusDosen(status, id) {
	const query = 'update dosen set status = ? where id = ?'
	const value = [status, id]

	return new Promise((resolve, reject) => {
		db.query(query, value, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function getAntrianByDosenID(professorID) {
	let query =
		'select mahasiswa.id, mahasiswa.avatar, mahasiswa.namaLengkap as fullname, prodi.nama as study, antrian.status, antrian.waktu as time from antrian left join mahasiswa on mahasiswa.id = antrian.idMahasiswa left join prodi on prodi.id=mahasiswa.idProdi where antrian.idDosen = ? and antrian.status != "completed" order by antrian.waktu'
	query = mysql.format(query, professorID)

	return new Promise((resolve, reject) => {
		db.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}

function updateAntrianStatusByMahasiswaID(id, time, status) {
	let query =
		'update antrian set status = ? where idMahasiswa = ? and waktu = ?'
	query = mysql.format(query, [status, id, time])
	return new Promise((resolve, reject) => {
		db.query(query, (error) => {
			if (error) {
				reject(err)
				return
			}

			resolve()
		})
	})
}

function requestBimbingan(idMahasiswa, idDosen) {
	const data = {
		idMahasiswa,
		idDosen,
		waktu: Date.now(),
		status: 'pending',
	}

	return new Promise((resolve, reject) => {
		db.query('insert into antrian set ? ', data, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function cancelBimbingan(time, studentID, professorID) {
	let query =
		'delete from antrian where idMahasiswa = ? and waktu = ? and idDosen = ?'
	query = mysql.format(query, [studentID, time, professorID])

	return new Promise((resolve, reject) => {
		db.query(query, (error) => {
			if (error) {
				reject(error)
			}

			resolve()
		})
	})
}

function getGenderByID(id, callback) {
	db.query('select * from gender where id = ?', id, (err, result, _fields) => {
		callback(err, result)
	})
}

function getDosenInfoByID(id, callback) {
	db.query(
		'select dosen.namaLengkap, dosen.nip, dosen.username, dosen.status, dosen.alamat, fakultas.nama as fakultas, dosen.avatar, gender.nama as gender from dosen left join fakultas on dosen.idFakultas = fakultas.id left join gender on dosen.idGender = gender.id where dosen.id = ?',
		id,
		(err, result, _fields) => {
			callback(err, result)
		},
	)
}

function getUserPassword(data) {
	const {id, role} = data
	let query = 'select password from ?? where id = ?'
	query = mysql.format(query, [role, id])

	return new Promise((resolve, reject) => {
		db.query(query, (error, result) => {
			if (error) {
				reject(error)
			}

			resolve(result[0])
		})
	})
}

function modifyPassword(data) {
	const {id, role, newPassword} = data
	let query = 'update ?? set password = ? where id = ?'
	query = mysql.format(query, [role, newPassword, id])

	return new Promise((resolve, reject) => {
		db.query(query, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function modifyMahasiswaProfile(data, callback) {
	const {id, ...props} = data
	let query = 'update mahasiswa set ? where id = ?'
	query = mysql.format(query, [props, id])
	
	return new Promise((resolve, reject) => {
		db.query(query, (error) => {
			if (error) {
				reject(error)
			}

			resolve()
		})
	})
}

function modifyDosenProfile(data) {
	const {id, ...props} = data
	let query = 'update dosen set ? where id = ?'
	query = mysql.format(query, [props, id])

	return new Promise((resolve, reject) => {
		db.query(query, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function getListMahasiswa(id) {
	let query =
		'select mahasiswa.id, mahasiswa.avatar, prodi.nama as study, mahasiswa.namaLengkap as fullname from mahasiswa left join prodi on mahasiswa.idProdi = prodi.id where idDosen = ?'
	query = mysql.format(query, id)

	return new Promise((resolve, reject) => {
		db.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}

function getMahasiswaByID(id) {
	let query =
		'select mahasiswa.semester, mahasiswa.avatar, mahasiswa.alamat as address, mahasiswa.username, mahasiswa.namaLengkap as fullname, mahasiswa.nim, prodi.nama as study, gender.nama as gender, dosen.namaLengkap as professor from mahasiswa left join prodi on mahasiswa.idProdi=prodi.id left join gender on mahasiswa.idGender=gender.id left join dosen on mahasiswa.idDosen=dosen.id where mahasiswa.id = ?'
	query = mysql.format(query, id)

	return new Promise((resolve, reject) => {
		db.query(query, (error, result) => {
			if (error) {
				reject(error)
				return
			}

			resolve(result[0])
		})
	})
}

module.exports = {
	db,
	addUser,
	findDosenByID,
	findMahasiswaByID,
	findDosenByUsername,
	findMahasiswaByUsername,
	getDosenByProdiID,
	checkUserByUsername,
	checkUserByIDNumber,
	getGenders,
	getProdi,
	updateStatusDosen,
	getProdiByID,
	getFakultas,
	getFakultasByID,
	getAntrianByDosenID,
	updateAntrianStatusByMahasiswaID,
	requestBimbingan,
	cancelBimbingan,
	getGenderByID,
	getDosenInfoByID,
	getUserPassword,
	modifyPassword,
	modifyMahasiswaProfile,
	modifyDosenProfile,
	getListMahasiswa,
	getMahasiswaByID,
}
