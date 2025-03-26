import { sql } from '@vercel/postgres';

export async function executeQuery(query, params = []) {
    try {
        const result = await sql.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('数据库查询错误:', error);
        throw error;
    }
}