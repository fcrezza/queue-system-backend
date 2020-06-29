const {checkUserByIDNumber, checkUserByUsername} = require('../../model')

function checkUsername(req, res) {
	checkUserByUsername(req.body.role, req.body.username, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		if (result.length) {
			return res.status(502).send({
				message: `Sudah ada ${req.body.role} yang menggunakan username ini`,
			})
		}

		return res.end()
	})
}

function checkUserByID(req, res) {
	checkUserByIDNumber(req.body.role, req.body.id, (err, result) => {
		if (err) {
			return res.status(502).send({message: 'upss, ada yang salah'})
		}

		if (result.length) {
			return res.status(502).send({
				message: `Sudah ada ${req.body.role} yang menggunakan ${
					Object.keys(result[0])[0]
				} ini`,
			})
		}

		return res.end()
	})
}

module.exports = {checkUsername, checkUserByID}
