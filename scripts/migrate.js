import { sql } from '@vercel/postgres';

async function createTables() {
    try {
        // 创建员工表
        await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(100),
        position VARCHAR(100),
        gender VARCHAR(10),
        age INT,
        phone VARCHAR(20),
        photo VARCHAR(255)
      )
    `;
        console.log('员工表创建成功');

        // 创建考勤表
        await sql`
      CREATE TABLE IF NOT EXISTS attendances (
        id SERIAL PRIMARY KEY,
        employeeId VARCHAR(50) NOT NULL,
        employeeName VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(20) NOT NULL,
        checkInTime VARCHAR(20),
        checkOutTime VARCHAR(20),
        notes TEXT
      )
    `;
        console.log('考勤表创建成功');

        // 创建请假表
        await sql`
      CREATE TABLE IF NOT EXISTS leaves (
        id SERIAL PRIMARY KEY,
        employeeId VARCHAR(50) NOT NULL,
        employeeName VARCHAR(100) NOT NULL,
        leaveType VARCHAR(50) NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        duration VARCHAR(20) NOT NULL,
        reason TEXT,
        status VARCHAR(20) NOT NULL
      )
    `;
        console.log('请假表创建成功');

        // 创建薪资表
        await sql`
      CREATE TABLE IF NOT EXISTS salaries (
        id SERIAL PRIMARY KEY,
        employeeId VARCHAR(50) NOT NULL,
        employeeName VARCHAR(100) NOT NULL,
        month VARCHAR(7) NOT NULL,
        baseSalary DECIMAL(10, 2) NOT NULL,
        bonus DECIMAL(10, 2),
        deduction DECIMAL(10, 2),
        totalSalary DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        paymentDate DATE
      )
    `;
        console.log('薪资表创建成功');

    } catch (error) {
        console.error('创建表失败:', error);
    }
}

createTables();