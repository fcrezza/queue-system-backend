const bcrypt = require('bcrypt')
const {
	getUserPassword,
	modifyPassword,
	modifyMahasiswaProfile,
	modifyDosenProfile,
} = require('../../model')

async function changePassword(req, res, next) {
	const {role, id, oldPassword, newPassword} = req.body

	try {
		const {password} = await getUserPassword({role, id})
		const matchOldPassword = await bcrypt.compare(oldPassword, password)
		if (!matchOldPassword) {
			res.status(500).json({message: 'Password lama anda tidak cocok'})
			return
		}
		const hashPassword = await bcrypt.hash(newPassword, 10)
		await modifyPassword({
			id,
			role,
			newPassword: hashPassword,
		})
		res.end()
	} catch (error) {
		next(error)
	}
}

async function changeMahasiswaProfile(req, res, next) {
	const {
		study: idProdi,
		gender: idGender,
		professor: idDosen,
		address: alamat,
		fullname: namaLengkap,
		...props
	} = req.body
	const data = {
		idProdi,
		idDosen,
		idGender,
		alamat,
		namaLengkap,
		...props,
	}

	try {
		await modifyMahasiswaProfile(data)
		res.end()
	} catch(error) {
		next(error)
	}
}

async function changeDosenProfile(req, res, next) {
	const {
		faculty: idFakultas,
		gender: idGender,
		address: alamat,
		fullname: namaLengkap,
		...props
	} = req.body
	const data = {
		idFakultas,
		alamat,
		idGender,
		namaLengkap,
		...props,
	}

	try {
		await modifyDosenProfile(data)
		res.end()
	} catch (error) {
		next(error)
	}
}

module.exports = {changePassword, changeMahasiswaProfile, changeDosenProfile}
