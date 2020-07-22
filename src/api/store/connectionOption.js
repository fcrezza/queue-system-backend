let connectionOption

if (process.NODE_ENV === 'production') {
	connectionOption = {
		host: process.env.MYSQL_ADDON_HOST,
		user: process.env.USER,
		password: process.env.PASSWORD,
		database: process.env.DB,
		port: process.env.PORT,
	}
} else {
	connectionOption = {
		host: 'localhost',
		user: 'root',
		password: 'lol001',
		database: 'bimbingan',
	}
}

module.exports = connectionOption
