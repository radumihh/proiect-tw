const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

// pool conexiuni mysql
const pool = mysql.createPool({
  host: "51.20.56.120",
  port: 3306,
  user: "radu",
  password: "bubu2004",
  database: "education_db",
  waitForConnections: true,
  connectionLimit: 10
});

// test conexiune
async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("DB OK", rows);
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

testConnection();

// config sequelize
const sequelize = new Sequelize(
  "education_db",
  "radu",
  "bubu2004",
  {
    host: "51.20.56.120",
    port: 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// attach pool la sequelize
sequelize.pool = pool;

module.exports = sequelize;
