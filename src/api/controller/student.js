const bcrypt = require('bcrypt')
const {
	modifyStudentProfile,
	modifyStudentPassword,
	findStudentByID,
	getStudentsUsername,
	getStudentsNIM,
	getStudentPassword,
} = require('../model/student')
const studentSchema = require('../validation/studentSchema')

async function changeStudentProfile(req, res, next) {
	try {
		const studentUsername = await getStudentsUsername(req.body.username)
		if (studentUsername) {
			if (
				studentUsername.username &&
				studentUsername.id !== parseInt(req.params.id, 10)
			) {
				res.status(403).json({
					message: 'Sudah ada yang menggunakan username ini',
				})
				return
			}
		}

		const studentNIM = await getStudentsNIM(req.body.nim)
		if (studentNIM) {
			if (studentNIM.nim && studentNIM.id !== parseInt(req.params.id, 10)) {
				res.status(403).json({
					message: 'Sudah ada yang menggunakan nim ini',
				})
				return
			}
		}
		const schema = await studentSchema({type: 'edit'})
		const validateInput = await schema.validate(req.body)
		const {
			study: idProdi,
			gender: idGender,
			professor: idDosen,
			address: alamat,
			fullname: namaLengkap,
			...props
		} = validateInput
		await modifyStudentProfile(req.params.id, {
			idProdi,
			idDosen,
			idGender,
			alamat,
			namaLengkap,
			...props,
		})
		res.end()
	} catch (error) {
		next(error)
	}
}

async function fetchStudentsByID(req, res, next) {
	try {
		const dataMahasiswa = await findStudentByID(req.params.id)
		res.json(dataMahasiswa)
	} catch (error) {
		next(error)
	}
}

async function fetchStudentsUsername(req, res, next) {
	try {
		const username = await getStudentsUsername(req.params.username)
		if (username) {
			res.status(403).json({
				message: `Sudah ada yang menggunakan username ini`,
			})
			return
		}

		res.end()
	} catch (error) {
		next(error)
	}
}

async function fetchStudentsNIM(req, res, next) {
	try {
		const studentsNIM = await getStudentsNIM(req.params.nim)

		if (studentsNIM) {
			res.status(403).json({
				message: `Sudah ada yang menggunakan NIM ini`,
			})
			return
		}

		res.end()
	} catch (error) {
		next(error)
	}
}

async function changeStudentPassword(req, res, next) {
	const {oldPassword, newPassword} = req.body
	const {id} = req.params
	try {
		const {password} = await getStudentPassword(id)
		const matchOldPassword = await bcrypt.compare(oldPassword, password)
		if (!matchOldPassword) {
			res.status(403).json({message: 'Password lama anda tidak cocok'})
			return
		}
		const hashPassword = await bcrypt.hash(newPassword, 10)
		await modifyStudentPassword({
			id,
			newPassword: hashPassword,
		})
		res.end()
	} catch (error) {
		next(error)
	}
}

module.exports = {
	fetchStudentsByID,
	changeStudentProfile,
	changeStudentPassword,
	fetchStudentsUsername,
	fetchStudentsNIM,
}
