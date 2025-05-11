
const mysql = require("mysql2");

let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12344",
  database: "shakedariel",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// התחברות למסד הנתונים ויצירת הסכמה אם היא לא קיימת
const createDatabaseAndTables = async () => {
  try {
    const connection = await pool.promise().getConnection();

    // יצירת הסכמה אם לא קיימת
    await connection.query(`CREATE DATABASE IF NOT EXISTS shakedariel`);
    await connection.query(`USE shakedariel`);

    // טבלת ספקים
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

    // טבלת משתמשים
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        permissions ENUM('admin', 'user', 'guest') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE
      )
    `;
    await connection.query(createUsersTableQuery);

    // טבלת מוצרים
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

    // טבלת הזמנות ספקים ✅
const createProviderOrdersTableQuery = `
CREATE TABLE IF NOT EXISTS provider_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  provider_name VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  price DECIMAL(10,2),
  estimated_delivery_time VARCHAR(100),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id)
)
`;
await connection.query(createProviderOrdersTableQuery);

    // טבלת שיוך מוצרים לספקים עם provider_name ✅
    const createProviderProductsTableQuery = `
      CREATE TABLE IF NOT EXISTS provider_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_number VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        provider_name VARCHAR(255), -- ✅ שדה חדש
        provider_id INT NOT NULL,
        price DECIMAL(10,2),
        estimated_delivery_time VARCHAR(100),
        min_order_quantity DECIMAL(10,2),
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (provider_id) REFERENCES providers(id)
      )
    `;
    await connection.query(createProviderProductsTableQuery);

    // טבלת פריטים בהזמנת ספק (provider_order_items)
const createProviderOrderItemsTableQuery = `
CREATE TABLE IF NOT EXISTS provider_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2) AS (quantity * unit_price) STORED,
  FOREIGN KEY (order_id) REFERENCES provider_orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
)
`;
await connection.query(createProviderOrderItemsTableQuery);


    // שחרור החיבור
    connection.release();
  } catch (err) {
    console.error("Error: " + err.message);
  }
};

// הפעלת יצירת בסיס הנתונים והטבלאות
createDatabaseAndTables();

module.exports = pool.promise();
