import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const id = params.id;
    try {
        const result = await sql`SELECT * FROM salaries WHERE id = ${id}`;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '薪资记录不存在' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const id = params.id;
    try {
        const { employeeId, employeeName, month, baseSalary, bonus, deduction, totalSalary, status, paymentDate } = await request.json();

        const result = await sql`
            UPDATE salaries 
            SET employeeId = ${employeeId}, 
                employeeName = ${employeeName}, 
                month = ${month}, 
                baseSalary = ${baseSalary}, 
                bonus = ${bonus}, 
                deduction = ${deduction}, 
                totalSalary = ${totalSalary}, 
                status = ${status}, 
                paymentDate = ${paymentDate}
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '薪资记录不存在' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const id = params.id;
    try {
        const result = await sql`DELETE FROM salaries WHERE id = ${id} RETURNING *`;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '薪资记录不存在' }, { status: 404 });
        }

        return NextResponse.json({ message: '薪资记录已删除' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}