const pool = require("./mysql2");

// בדיקת קיום ספק לפי אימייל
const checkIfEmailExists = (email) => {
  return pool.execute(
    `SELECT * FROM providers WHERE email = ?`,
    [email]
  );
};

// הוספת ספק חדש
const insertNewProvider = (name, contact_name, phone_number, address, email, is_active) => {
  return pool.execute(
    `INSERT INTO providers (name, contact_name, phone_number, address, email, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, contact_name, phone_number, address, email, is_active]
  );
};

// קבלת כל הספקים
const getAllProviders = () => {
  return pool.execute(
    `SELECT * FROM providers`
  );
};
// קבלת כל הספקים
const getProvidersById = (id) => {
  return pool.execute(
    `SELECT * FROM providers where id = ?`,[id]
  );
};
// עדכון ספק
const updateProviderById = (id, name, contact_name, phone_number, address, email, is_active) => {
  return pool.execute(
    `UPDATE providers 
     SET name = ?, contact_name = ?, phone_number = ?, address = ?, email = ?, is_active = ? 
     WHERE id = ?`,
    [name, contact_name, phone_number, address, email, is_active, id]
  );
};

// מחיקת ספק לפי ID
const deleteProviderById = (id) => {
  return pool.execute(
    `DELETE FROM providers WHERE id = ?`,
    [id]
  );
};

// ייצוא
module.exports = {
  checkIfEmailExists,
  insertNewProvider,
  getAllProviders,
  updateProviderById,
  deleteProviderById,
  getProvidersById
};
