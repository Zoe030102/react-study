// server/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有员工
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM employees');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 添加新员工
router.post('/', async (req, res) => {
    const { name, position, salary, hire_date } = req.body;
    try {
        const result = await db.execute(
            'INSERT INTO employees (name, position, salary, hire_date) VALUES (?, ?, ?, ?)',
            [name, position, salary, hire_date]
        );
        res.status(201).json({ id: result[0].insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
