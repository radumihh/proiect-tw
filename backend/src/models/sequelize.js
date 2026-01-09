const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

// Pool de conexiuni MySQL nativ pentru query-uri directe
const pool = mysql.createPool({
  host: "51.20.56.120", // IP-ul public al VM-ului
  port: 3306,            // portul MySQL
  user: "radu",
  password: "bubu2004",
  database: "education_db",
  waitForConnections: true,
  connectionLimit: 10
});

// Test conexiune
async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("DB OK", rows);
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

testConnection();

// Configurare Sequelize cu aceleași credențiale
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

// Atașăm pool-ul la sequelize pentru a-l putea folosi
sequelize.pool = pool;

module.exports = sequelize;
