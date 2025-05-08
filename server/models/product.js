const pool = require("./mysql2");

// קבלת כל המוצרים
const getAllProducts = () => {
  return pool.execute(`SELECT * FROM products`);
};

// הוספת מוצר חדש
const insertNewProduct = (name, category, quantity, unit, min_required,last_updated, is_active ) => {
  return pool.execute(
    `INSERT INTO products (name, category, quantity, unit, min_required,last_updated, is_active) 
     VALUES (?, ?, ?, ?, ?, ?,?)`,
    [name, category, quantity, unit, min_required,last_updated, is_active]
  );
};

// עדכון מוצר לפי ID
const updateProductById = (id, name, category, quantity, unit, min_required, is_active) => {
  return pool.execute(
    `UPDATE products 
     SET name = ?, category = ?, quantity = ?, unit = ?, min_required = ?, is_active = ? 
     WHERE id = ?`,
    [name, category, quantity, unit, min_required, is_active, id]
  );
};
// קבלת כל המוצרים
const getProductsById = (id) => {
  return pool.execute(`SELECT * FROM products WHERE id = ?`,[id]);
};


const updateProductQuantity = (quantity,id) => {
  return pool.execute(
    `UPDATE products SET quantity = ? WHERE id = ?`,
    [quantity,id]
  );
};





// מחיקת מוצר לפי ID
const deleteProductById = (id) => {
  return pool.execute(
    `DELETE FROM products WHERE id = ?`,
    [id]
  );
};

// בדיקה אם מוצר קיים לפי שם
const checkIfProductExistsByName = (name) => {
  return pool.execute(
    `SELECT * FROM products WHERE name = ?`,
    [name]
  );
};

module.exports = {
  getAllProducts,
  insertNewProduct,
  updateProductById,
  deleteProductById,
  checkIfProductExistsByName,
  updateProductQuantity,
  getProductsById
};
