const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlr2h', 
    database: 'CCLoginApp',
});

module.exports = connection;