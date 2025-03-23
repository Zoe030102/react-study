const express = require('express');
// 将 mysql 替换为 mysql2
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
// 删除重复声明,使用已存在的connection变量
connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
// 修改端口为5000，与前端一致
const PORT = 5000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 数据库连接
const connection = mysql.createConnection({
    host: 'localhost',      // 数据库服务器地址
    user: 'root',           // 数据库用户名
    password: 'ly2757787219', // 数据库密码
    database: 'hotel'       // 数据库名称
});

// 连接数据库
connection.connect(err => {
    if (err) {
        console.error('数据库连接失败:', err);
    } else {
        console.log('成功连接到MySQL数据库');
    }
});

// 在API中使用数据库连接
app.get('/api/attendances', (req, res) => {
    const query = 'SELECT * FROM attendances';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/api/attendances', (req, res) => {
    const { employeeId, employeeName, date, status, checkInTime, checkOutTime, notes } = req.body;
    const query = 'INSERT INTO attendances (employeeId, employeeName, date, status, checkInTime, checkOutTime, notes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [employeeId, employeeName, date, status, checkInTime, checkOutTime, notes], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId });
    });
});

app.put('/api/attendances/:id', (req, res) => {
    const id = req.params.id;
    const { status, checkOutTime } = req.body;
    let query = 'UPDATE attendances SET ';
    const params = [];

    if (status) {
        query += 'status = ?';
        params.push(status);
    }

    if (checkOutTime) {
        if (params.length > 0) query += ', ';
        query += 'checkOutTime = ?';
        params.push(checkOutTime);
    }

    query += ' WHERE id = ?';
    params.push(id);

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '考勤记录已更新' });
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
