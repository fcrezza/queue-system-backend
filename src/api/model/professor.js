const {mysql, connection} = require('../store')

function findProfessorByID(id) {
	let query =
		'select dosen.id, dosen.namaLengkap fullname, dosen.nip,dosen.username,dosen.alamat as address,dosen.avatar,dosen.status,fakultas.id as facultyID,fakultas.nama as facultyName,gender.id genderID,gender.nama genderName from dosen left join fakultas on dosen.idFakultas=fakultas.id left join gender on gender.id=dosen.idGender where dosen.id = ?'
	query = mysql.format(query, [id])

	return new Promise((resolve, reject) => {
		connection.query(query, (error, results) => {
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

function modifyProfessorProfile(id, data) {
	let query = 'update dosen set ? where id = ?'
	query = mysql.format(query, [data, id])
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

function updateProfessorStatus(status, id) {
	const query = 'update dosen set status = ? where id = ?'
	const value = [status, id]

	return new Promise((resolve, reject) => {
		connection.query(query, value, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function findProfessorByUsername(username) {
	let query = 'select id, username, password from dosen where username = ?'
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

function getProfessorsUsername(username) {
	const query = 'select id, username from dosen where username = ?'

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

function getProfessorsNIP(nip) {
	return new Promise((resolve, reject) => {
		connection.query(
			'select id, nip from dosen where nip = ?',
			nip,
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

function getProfessorPassword(id) {
	const query = 'select password from dosen where id = ?'
	return new Promise((resolve, reject) => {
		connection.query(query, id, (error, result) => {
			if (error) {
				reject(error)
			}

			resolve(result[0])
		})
	})
}

function modifyProfessorPassword({id, newPassword}) {
	let query = 'update dosen set password = ? where id = ?'
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

function getStudentsByProfessorID(id) {
	let query =
		'select mahasiswa.id, mahasiswa.avatar, prodi.nama as study, mahasiswa.namaLengkap as fullname from mahasiswa left join prodi on mahasiswa.idProdi = prodi.id where idDosen = ?'
	query = mysql.format(query, id)

	return new Promise((resolve, reject) => {
		connection.query(query, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}


module.exports = {
	findProfessorByUsername,
	updateProfessorStatus,
	modifyProfessorProfile,
	findProfessorByID,
	getProfessorsUsername,
	getProfessorsNIP,
	getProfessorPassword,
	getStudentsByProfessorID,
	modifyProfessorPassword
}
