const query = require('../store')

function signup(formData) {
	const {role, ...data} = formData

	if (role === 'professor') {
		return new Promise((resolve, reject) => {
			query('insert into dosen set ?', data, (error) => {
				if (error) {
					reject(error)
					return
				}

				resolve()
			})
		})
	}

	return new Promise((resolve, reject) => {
		query('insert into mahasiswa set ?', data, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function updateQueueStatusByStudentID(id, time, status) {
	const statement =
		'update antrian set status = ? where idMahasiswa = ? and waktu = ?'
	return new Promise((resolve, reject) => {
		query(statement, [status, id, time], (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function requestQueue(idMahasiswa, idDosen) {
	const data = {
		idMahasiswa,
		idDosen,
		waktu: Date.now(),
		status: 'pending',
	}

	return new Promise((resolve, reject) => {
		query('insert into antrian set ? ', data, (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function cancelQueue(time, studentID, professorID) {
	const statement =
		'delete from antrian where idMahasiswa = ? and waktu = ? and idDosen = ?'

	return new Promise((resolve, reject) => {
		query(statement, [studentID, time, professorID], (error) => {
			if (error) {
				reject(error)
			}

			resolve()
		})
	})
}

function getGenders() {
	return new Promise((resolve, reject) => {
		query('select * from gender', null, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}

function getStudyPrograms() {
	return new Promise((resolve, reject) => {
		query('select * from prodi', null, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}

function getFaculties() {
	return new Promise((resolve, reject) => {
		query('select * from fakultas', null, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}

function getQueueByProfessorID(professorID) {
	const statement =
		'select mahasiswa.id, mahasiswa.avatar, mahasiswa.namaLengkap as fullname, prodi.nama as study, antrian.status, antrian.waktu as time from antrian left join mahasiswa on mahasiswa.id = antrian.idMahasiswa left join prodi on prodi.id=mahasiswa.idProdi where antrian.idDosen = ? and antrian.status != "completed" order by antrian.waktu'

	return new Promise((resolve, reject) => {
		query(statement, professorID, (error, results) => {
			if (error) {
				reject(error)
				return
			}

			resolve(results)
		})
	})
}

function getProfessorsByStudyProgram(id) {
	const statement =
		'SELECT dosen.id, dosen.namaLengkap fullname, dosen.avatar, fakultas.nama as faculty from dosen left join fakultas on dosen.idFakultas = fakultas.id left join prodi on fakultas.id = prodi.idFakultas where prodi.id = ? GROUP by dosen.id'

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
	getQueueByProfessorID,
	getFaculties,
	getStudyPrograms,
	getGenders,
	getProfessorsByStudyProgram,
	cancelQueue,
	requestQueue,
	updateQueueStatusByStudentID,
	signup,
}
