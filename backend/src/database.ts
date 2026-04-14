import 'dotenv/config';
import { Pool } from 'pg';

export class DataIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataIntegrityError';
  }
}

export class NonUniqueDataError extends DataIntegrityError {
  constructor(resultCount: number) {
    super(`Expected one or zero results from query, but got ${resultCount}`);
  }
}

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export async function getImageLink(name: string): Promise<string | null> {
  const query = 'SELECT * FROM image_links WHERE name = $1';
  const values = [name];

  const res = await db.query(query, values);
  if (res.rowCount && res.rowCount > 1) {
    throw new NonUniqueDataError(res.rowCount);
  }

  const row = res.rows[0];

  return row?.link ?? null;
}

export async function getUserByEmail(email: string) : Promise<Object | null> {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  const res = await db.query(query, values);
  if (res.rowCount && res.rowCount > 1) {
    throw new NonUniqueDataError(res.rowCount);
  }

  const row = res.rows[0];

  return row ?? null;
}

export type User = {
  email: string;
  name: string;
  studentPhone: string;
  parentPhone: string;
  specialization: string;
  governorate: string;
  year: string;
  password: string; // hashed
};

export async function insertUser(user: User) {
  const query = `INSERT INTO users(name, email, password, student_phone, parent_phone, year, governorate)
                 VALUES($1, $2, $3, $4, $5, $6, $7)`;
  const values = [
    user.name, user.email, user.password, user.studentPhone, user.parentPhone, user.year, user.governorate
  ];

  await db.query(query, values);
}

export default db;
