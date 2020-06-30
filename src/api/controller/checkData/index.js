const {checkUserIdentity, checkUserByUsername} = require('../../model')
// use this
async function checkUsername(req, res) {
	const {role, username} = req.body
	try {
		const check = await checkUserByUsername(role, username)
		if (check) {
			res.status(502).json({
				message: `Sudah ada yang menggunakan username ini`,
			})
			return
		}

		res.end()
	} catch (error) {
		res.status(502).json({message: 'upss, ada yang salah'})
	}
}
// use this
async function checkUserByIdentity(req, res, next) {
	const {role, userIdentity} = req.body
	const identity = role === 'student' ? 'nim' : 'nip'
	try {
		const check = await checkUserIdentity(userIdentity, role)

		if (check) {
			res.status(502).json({
				message: `Sudah ada yang menggunakan ${identity} ini`,
			})
			return
		}

		res.end()
	} catch (error) {
		next(error)
	}
}

module.exports = {checkUsername, checkUserByIdentity}
