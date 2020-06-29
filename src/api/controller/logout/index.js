function logout(req, res, next) {
	req.logout()
	req.session.destroy((err) => {
		if (err) {
			return next(err)
		}

		res.clearCookie('connect.sid', {path: '/'})
		return res.end()
	})
}

module.exports = logout
