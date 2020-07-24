const mysql = require('mysql')

const connectionOption = require('./connectionOption')

const pool = mysql.createPool(connectionOption)

function query(statement, values, callback) {
	pool.getConnection((err, connection) => {
		if (err) {
			callback(err, null)
		} else {
			connection.query(statement, values, (error, results) => {
				connection.release()
				callback(error, results)
			})
		}
	})
}

module.exports = query
