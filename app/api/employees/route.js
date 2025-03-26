import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const employees = await sql`SELECT * FROM employees`;
        return NextResponse.json(employees.rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name, department, position, gender, age, phone, photo } = await request.json();
        const result = await sql`
            INSERT INTO employees (name, department, position, gender, age, phone, photo) 
            VALUES (${name}, ${department}, ${position}, ${gender}, ${age}, ${phone}, ${photo}) 
            RETURNING *
        `;
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}