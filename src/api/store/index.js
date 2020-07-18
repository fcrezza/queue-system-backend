const mysql = require('mysql')
const connectionOption = require('./connectionOption')

const connection = mysql.createConnection(connectionOption)

module.exports = {connection, mysql}
