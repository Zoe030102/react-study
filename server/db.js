// server/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ly2757787219', // 替换为您的 MySQL 密码
    database: 'hotel_db',
    port: 3306,
});

module.exports = pool.promise();
