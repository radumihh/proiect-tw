import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();


const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_evaluation',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10)
});

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("DB OK", rows);
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

// Testează conexiunea la pornire (doar în mediu non-production)
if (process.env.NODE_ENV !== 'production') {
  testConnection();
}

export default pool;
