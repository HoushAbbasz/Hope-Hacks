const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlr2h', 
    database: 'CCLoginApp',
});

connection
    .promise()
    .query('SELECT * FROM users')
    .then(([rows, fields]) => {
    console.log(rows);
});

module.exports = connection;