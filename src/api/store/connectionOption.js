let connectionOption

if (process.env.NODE_ENV === 'production') {
	connectionOption = {
		host: process.env.MYSQL_ADDON_HOST,
		user: process.env.MYSQL_ADDON_USER,
		password: process.env.MYSQL_ADDON_PASSWORD,
		database: process.env.MYSQL_ADDON_DB,
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
