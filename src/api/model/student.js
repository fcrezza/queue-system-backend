const {mysql, connection} = require('../store')

function modifyStudentProfile(id, data) {
	let query = 'update mahasiswa set ? where id = ?'
	query = mysql.format(query, [data, id])

	return new Promise((resolve, reject) => {
		connection.query(query, (error) => {
			if (error) {
				reject(error)
			}

			resolve()
		})
	})
}

function findStudentByID(id) {
	let query =
		'select mahasiswa.id, mahasiswa.namaLengkap as fullname, mahasiswa.nim,mahasiswa.username,mahasiswa.alamat as address,mahasiswa.avatar,mahasiswa.semester, prodi.id as studyID,prodi.nama as studyName,gender.id as genderID,gender.nama as genderName, dosen.id as professorID, dosen.namaLengkap as professorName from mahasiswa left join prodi on mahasiswa.idProdi=prodi.id left join gender on gender.id=mahasiswa.idGender left join dosen on mahasiswa.idDosen = dosen.id where mahasiswa.id = ?'
	query = mysql.format(query, id)

	return new Promise((resolve, reject) => {
		connection.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			const {studyName, studyID, professorID, professorName, genderID, genderName, ...props} = results[0]
			const data = {
				study: {
					id: studyID,
					name: studyName,
				},
				gender: {
					id: genderID,
					name: genderName,
				},
				professor: {
					id: professorID,
					name: professorName
				},
				...props,
			}
			resolve(data)
		})
	})
}

function findStudentByUsername(username) {
	let query = 'select id, username, password from mahasiswa where username = ?'
	query = mysql.format(query, username)

	return new Promise((resolve, reject) => {
		connection.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results[0])
		})
	})
}

function getStudentsUsername(username) {
	const query = 'select id, username from mahasiswa where username = ?'

	return new Promise((resolve, reject) => {
		connection.query(query, username, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results[0])
		})
	})
}

function getStudentsNIM(nim) {
	return new Promise((resolve, reject) => {
		connection.query(
			'select id, nim from mahasiswa where nim = ?',
			nim,
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

function getStudentPassword(id) {
	const query = 'select password from mahasiswa where id = ?'
	return new Promise((resolve, reject) => {
		connection.query(query, id, (error, result) => {
			if (error) {
				reject(error)
			}

			resolve(result[0])
		})
	})
}

function modifyStudentPassword({id, newPassword}) {
	let query = 'update mahasiswa set password = ? where id = ?'
	query = mysql.format(query, [newPassword, id])

	return new Promise((resolve, reject) => {
		connection.query(query, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

module.exports = {
	getStudentsUsername,
	findStudentByUsername,
	modifyStudentProfile,
	findStudentByID,
	getStudentsNIM,
	getStudentPassword,
	modifyStudentPassword
}
