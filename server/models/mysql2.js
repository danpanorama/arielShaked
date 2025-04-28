const mysql = require("mysql2");

let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12344",
  database: "shakedariel",  // לא מציינים סכמה כאן, כי נוודא שהיא תיווצר אם היא לא קיימת
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
    ("Database 'shakedariel' created or already exists.");
    
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
    ("Table 'providers' created successfully or already exists.");


        // יצירת טבלה 'users' אם היא לא קיימת
    const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,  
      name VARCHAR(255) NOT NULL,  
      email VARCHAR(255) NOT NULL UNIQUE,  
      phone_number VARCHAR(20),  
      password VARCHAR(255) NOT NULL,  
      permissions ENUM('admin', 'user', 'guest') DEFAULT 'user', 
      is_active BOOLEAN DEFAULT TRUE  
    )
    `;

    await connection.query(createUsersTableQuery);
    ("Table 'users' created successfully or already exists.");

// יצירת טבלה 'products' אם היא לא קיימת
const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    min_required DECIMAL(10,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
  )
`;

await connection.query(createProductsTableQuery);
("Table 'products' created successfully or already exists.");


// יצירת טבלה 'provider_products' אם היא לא קיימת
const createProviderProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS provider_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_number VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    provider_id INT NOT NULL,
    price DECIMAL(10,2),
    estimated_delivery_time VARCHAR(100),
    min_order_quantity DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
  )
`;

await connection.query(createProviderProductsTableQuery);
("Table 'provider_products' created successfully or already exists.");





    // שחרור החיבור
    connection.release();
  } catch (err) {
    console.error("Error: " + err.message);
  }
};

// קריאה לפונקציה ליצירת הסכמה והטבלאות כאשר הקובץ נטען
createDatabaseAndTables();

module.exports = pool.promise();
