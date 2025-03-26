import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const id = params.id;
    try {
        const result = await sql`SELECT * FROM attendances WHERE id = ${id}`;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '考勤记录不存在' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const id = params.id;
    try {
        const { employeeId, employeeName, date, status, checkInTime, checkOutTime, notes } = await request.json();

        const result = await sql`
            UPDATE attendances 
            SET employeeId = ${employeeId}, 
                employeeName = ${employeeName}, 
                date = ${date}, 
                status = ${status}, 
                checkInTime = ${checkInTime}, 
                checkOutTime = ${checkOutTime}, 
                notes = ${notes}
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '考勤记录不存在' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const id = params.id;
    try {
        const result = await sql`DELETE FROM attendances WHERE id = ${id} RETURNING *`;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '考勤记录不存在' }, { status: 404 });
        }

        return NextResponse.json({ message: '考勤记录已删除' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}