const mysql = require('mysql')

const connectionOption = require('./connectionOption')

let connection
function connectDB() {
	connection = mysql.createConnection(connectionOption)

	connection.connect((err) => {
		if (err) {
			console.log('error when connecting to db:', err)
			setTimeout(connectDB, 2000)
		}
	})

	connection.on('error', (err) => {
		console.log('db error', err)
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			connectDB()
		} else {
			throw err
		}
	})
}

connectDB()

module.exports = {connection, mysql}
