import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const salaries = await sql`SELECT * FROM salaries ORDER BY month DESC`;
        return NextResponse.json(salaries.rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { employeeId, employeeName, month, baseSalary, bonus, deduction, totalSalary, status, paymentDate } = await request.json();
        const result = await sql`
            INSERT INTO salaries (employeeId, employeeName, month, baseSalary, bonus, deduction, totalSalary, status, paymentDate) 
            VALUES (${employeeId}, ${employeeName}, ${month}, ${baseSalary}, ${bonus}, ${deduction}, ${totalSalary}, ${status}, ${paymentDate}) 
            RETURNING *
        `;
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}