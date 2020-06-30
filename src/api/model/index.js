const mysql = require('mysql')
const dbOption = require('../dbOption')

const db = mysql.createConnection(dbOption)
// use this
function findProfessorByUsername(username) {
	let query = 'select id, username, password from dosen where username = ?'
	query = mysql.format(query, username)

	return new Promise((resolve, reject) => {
		db.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results[0])
		})
	})
}
// use this
function findStudentByUsername(username) {
	let query = 'select id, username, password from mahasiswa where username = ?'
	query = mysql.format(query, username)

	return new Promise((resolve, reject) => {
		db.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results[0])
		})
	})
}
// use this
function findProfessorByID(id) {
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
function findStudentByID(id) {
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
function getGenders() {
	return new Promise((resolve, reject) => {
		db.query('select * from gender', (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}
// use this
function getStudyPrograms() {
	return new Promise((resolve, reject) => {
		db.query('select * from prodi', (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}
// use this
function getFaculties() {
	return new Promise((resolve, reject) => {
		db.query('select * from fakultas', (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}
// use this
function getProfessorsByStudyID(studyID) {
		const query =
	'SELECT dosen.id, dosen.namaLengkap fullname, dosen.avatar, fakultas.nama as faculty from dosen left join fakultas on dosen.idFakultas = fakultas.id left join prodi on fakultas.id = prodi.idFakultas where prodi.id = ? GROUP by dosen.id'

	return new Promise((resolve, reject) => {
		db.query(query, studyID, (error, results) => {
			if (error) {
				reject(error)
				return
			} 

			resolve(results)
		})
	})
}
// use this
function checkUserByUsername(role, username) {
	const table = role === 'student' ? 'mahasiswa' : 'dosen'
	let query = 'select username from ?? where username = ?'
	query = mysql.format(query, [table, username])

	return new Promise((resolve, reject) => {
		db.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results[0])
		})
	})
}
// use this
function checkUserIdentity(userIdentity, role) {
	if (role === 'student') {
		return new Promise((resolve, reject) => {
			db.query(
				'select nim from mahasiswa where nim = ?',
				userIdentity,
				(error, results) => {
					if (error) {
						reject(error)
						return
					}

					resolve(results[0])
				},
			)
		})
	}

	return new Promise((resolve, reject) => {
		db.query(
			'select nip from dosen where nip = ?',
			userIdentity,
			(error, results) => {
				if (error) {
					reject(error)
					return
				}

				resolve(results[0])
			},
		)
	})
}
// use this
function registerUser(formData) {
	const {role, ...data} = formData

	if (role === 'professor') {
		return new Promise((resolve, reject) => {
			db.query('insert into dosen set ?', data, (error) => {
				if (error) {
					reject(error)
					return
				}

				resolve()
			})
		})
	}

	return new Promise((resolve, reject) => {
		db.query('insert into mahasiswa set ?', data, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
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
	const {id, user} = data
	let query = 'select password from ?? where id = ?'
	query = mysql.format(query, [user, id])

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
	const {id, user, newPassword} = data
	let query = 'update ?? set password = ? where id = ?'
	query = mysql.format(query, [user, newPassword, id])

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

function modifyMahasiswaProfile(data) {
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

function getListStudentsByProfessorID(id) {
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
	registerUser,
	findProfessorByID,
	findStudentByID,
	findProfessorByUsername,
	findStudentByUsername,
	getProfessorsByStudyID,
	checkUserByUsername,
	checkUserIdentity,
	getGenders,
	getStudyPrograms,
	getFaculties,
	updateStatusDosen,
	getProdiByID,
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
	getListStudentsByProfessorID,
	getMahasiswaByID,
}
