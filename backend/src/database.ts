import 'dotenv/config'
import { Pool } from "pg";

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

export async function getImageLink(name: string): Promise<string | null>
{
    const query = "SELECT * FROM image_links WHERE name = $1";
    const values = [name];

    const res = await db.query(query, values);
    const row = res.rows[0];

    return row?.link ?? null;
}

export default db;