import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const id = params.id;
    try {
        const result = await sql`SELECT * FROM leaves WHERE id = ${id}`;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '请假记录不存在' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const id = params.id;
    try {
        const { employeeId, employeeName, leaveType, startDate, endDate, duration, reason, status } = await request.json();

        const result = await sql`
            UPDATE leaves 
            SET employeeId = ${employeeId}, 
                employeeName = ${employeeName}, 
                leaveType = ${leaveType}, 
                startDate = ${startDate}, 
                endDate = ${endDate}, 
                duration = ${duration}, 
                reason = ${reason}, 
                status = ${status}
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '请假记录不存在' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const id = params.id;
    try {
        const result = await sql`DELETE FROM leaves WHERE id = ${id} RETURNING *`;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '请假记录不存在' }, { status: 404 });
        }

        return NextResponse.json({ message: '请假记录已删除' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}