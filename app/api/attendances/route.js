import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const attendances = await sql`SELECT * FROM attendances ORDER BY date DESC`;
        return NextResponse.json(attendances.rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { employeeId, employeeName, date, status, checkInTime, checkOutTime, notes } = await request.json();
        const result = await sql`
            INSERT INTO attendances (employeeId, employeeName, date, status, checkInTime, checkOutTime, notes) 
            VALUES (${employeeId}, ${employeeName}, ${date}, ${status}, ${checkInTime}, ${checkOutTime}, ${notes}) 
            RETURNING *
        `;
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}