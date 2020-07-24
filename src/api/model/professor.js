const query = require('../store')

function findProfessorByID(id) {
	const statement =
		'select dosen.id, dosen.namaLengkap fullname, dosen.nip,dosen.username,dosen.alamat as address,dosen.avatar,dosen.status,fakultas.id as facultyID,fakultas.nama as facultyName,gender.id genderID,gender.nama genderName from dosen left join fakultas on dosen.idFakultas=fakultas.id left join gender on gender.id=dosen.idGender where dosen.id = ?'

	return new Promise((resolve, reject) => {
		query(statement, id, (error, results) => {
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
	return new Promise((resolve, reject) => {
		query('update dosen set ? where id = ?', [data, id], (error) => {
			if (error) {
				reject(error)
				return
			}
			resolve()
		})
	})
}

function updateProfessorStatus(status, id) {
	return new Promise((resolve, reject) => {
		query('update dosen set status = ? where id = ?', [status, id], (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function findProfessorByUsername(username) {
	const statement = 'select id, username, password from dosen where username = ?'

	return new Promise((resolve, reject) => {
		query(statement, username, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results[0])
		})
	})
}

function getProfessorsUsername(username) {
	const statement = 'select id, username from dosen where username = ?'

	return new Promise((resolve, reject) => {
		query(statement, username, (error, results) => {
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
		query('select id, nip from dosen where nip = ?', nip, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results[0])
		})
	})
}

function getProfessorPassword(id) {
	return new Promise((resolve, reject) => {
		query('select password from dosen where id = ?', id, (error, result) => {
			if (error) {
				reject(error)
			}

			resolve(result[0])
		})
	})
}

function modifyProfessorPassword({id, newPassword}) {
	const statement = 'update dosen set password = ? where id = ?'

	return new Promise((resolve, reject) => {
		query(statement, [newPassword, id], (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function getStudentsByProfessorID(id) {
	const statement =
		'select mahasiswa.id, mahasiswa.avatar, prodi.nama as study, mahasiswa.namaLengkap as fullname from mahasiswa left join prodi on mahasiswa.idProdi = prodi.id where idDosen = ?'

	return new Promise((resolve, reject) => {
		query(statement, id, (error, results) => {
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
	modifyProfessorPassword,
}
