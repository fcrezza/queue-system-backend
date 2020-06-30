const bcrypt = require('bcrypt')
const {
	getUserPassword,
	modifyPassword,
	modifyMahasiswaProfile,
	modifyDosenProfile,
} = require('../../model')

async function changePassword(req, res, next) {
	const {role, id, oldPassword, newPassword} = req.body
	const user = role === 'student' ? 'mahasiswa' : 'dosen' 
	try {
		const {password} = await getUserPassword({user, id})
		const matchOldPassword = await bcrypt.compare(oldPassword, password)
		if (!matchOldPassword) {
			res.status(500).json({message: 'Password lama anda tidak cocok'})
			return
		}
		const hashPassword = await bcrypt.hash(newPassword, 10)
		await modifyPassword({
			id,
			user,
			newPassword: hashPassword,
		})
		res.end()
	} catch (error) {
		next(error)
	}
}

async function changeMahasiswaProfile(req, res) {
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
		res.status(502).json({message: 'uppzzz, coba lagi nanti'})
	}
}

async function changeDosenProfile(req, res) {
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
		res.status(502).json({message: 'uppzzz, coba lagi nanti'})
	}
}

module.exports = {changePassword, changeMahasiswaProfile, changeDosenProfile}
