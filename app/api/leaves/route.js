import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const leaves = await sql`SELECT * FROM leaves ORDER BY startdate DESC`;
        return NextResponse.json(leaves.rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { employeeId, employeeName, leaveType, startDate, endDate, duration, reason, status } = await request.json();
        const result = await sql`
            INSERT INTO leaves (employeeId, employeeName, leaveType, startDate, endDate, duration, reason, status) 
            VALUES (${employeeId}, ${employeeName}, ${leaveType}, ${startDate}, ${endDate}, ${duration}, ${reason}, ${status}) 
            RETURNING *
        `;
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}