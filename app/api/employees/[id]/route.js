import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const result = await sql`SELECT * FROM employees WHERE id = ${id}`;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '员工不存在' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, department, position, gender, age, phone, photo } = await request.json();

        const result = await sql`
            UPDATE employees 
            SET name = ${name}, 
                department = ${department}, 
                position = ${position}, 
                gender = ${gender}, 
                age = ${age}, 
                phone = ${phone}, 
                photo = ${photo} 
            WHERE id = ${id} 
            RETURNING *
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '员工不存在' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const result = await sql`DELETE FROM employees WHERE id = ${id} RETURNING *`;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: '员工不存在' }, { status: 404 });
        }

        return NextResponse.json({ message: '员工删除成功' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}