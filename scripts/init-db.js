const { sql } = require('@vercel/postgres');

async function initDatabase() {
    try {
        // 创建员工表
        await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        gender VARCHAR(10),
        birthdate DATE,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        department VARCHAR(50),
        position VARCHAR(50),
        hiredate DATE,
        salary DECIMAL(10, 2),
        status VARCHAR(20) DEFAULT '在职'
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
        status VARCHAR(20) DEFAULT '正常',
        checkInTime TIME,
        checkOutTime TIME,
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
        leaveType VARCHAR(20) NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        duration VARCHAR(20) NOT NULL,
        reason TEXT,
        status VARCHAR(20) DEFAULT '待审批'
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
        bonus DECIMAL(10, 2) DEFAULT 0,
        deduction DECIMAL(10, 2) DEFAULT 0,
        totalSalary DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT '未发放',
        paymentDate DATE
      )
    `;
        console.log('薪资表创建成功');

        console.log('所有数据库表创建完成');
    } catch (error) {
        console.error('创建数据库表时出错:', error);
    }
}

initDatabase();