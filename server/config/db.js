//資料庫連接的組態

const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'88888888',
    database:'giftsys'
})

module.exports = connection;
