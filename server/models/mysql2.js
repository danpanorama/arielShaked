const mysql = require("mysql2");

let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12344",
  database: "",  // לא מציינים סכמה כאן, כי נוודא שהיא תיווצר אם היא לא קיימת
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// התחברות למסד הנתונים ויצירת הסכמה אם היא לא קיימת
const createDatabaseAndTables = async () => {
  try {
    const connection = await pool.promise().getConnection();
    
    // יצירת הסכמה (Database) אם היא לא קיימת
    await connection.query(`CREATE DATABASE IF NOT EXISTS shakedariel`);
    console.log("Database 'shakedariel' created or already exists.");
    
    // התחברות אל הסכמה 'shakedariel'
    await connection.query(`USE shakedariel`);
    
    // יצירת טבלה 'providers' אם היא לא קיימת
    const createProvidersTableQuery = `
      CREATE TABLE IF NOT EXISTS providers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        phone_number VARCHAR(20),
        address VARCHAR(255),
        email VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE
      )
    `;
    await connection.query(createProvidersTableQuery);
    console.log("Table 'providers' created successfully or already exists.");

    // יצירת טבלה 'users' אם היא לא קיימת
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(20),
        permissions ENUM('admin', 'user', 'guest') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE
      )
    `;
    await connection.query(createUsersTableQuery);
    console.log("Table 'users' created successfully or already exists.");

    // שחרור החיבור
    connection.release();
  } catch (err) {
    console.error("Error: " + err.message);
  }
};

// קריאה לפונקציה ליצירת הסכמה והטבלאות כאשר הקובץ נטען
createDatabaseAndTables();

module.exports = pool.promise();
