const pool = require("./mysql2");

// שליפת כל המוצרים ששויכו לספקים
const getAllProviderProducts = () => {
  return pool.execute(`SELECT * FROM provider_products`);
};

// שליפת מוצר משויך לפי ID
const getProviderProductById = (id) => {
  return pool.execute(`SELECT * FROM provider_products WHERE id = ?`, [id]);
};

// הוספת מוצר משויך חדש
const insertNewProviderProduct = (
  item_number,
  name,
  provider_id,
  price,
  estimated_delivery_time,
  min_order_quantity,
  is_active
) => {
  return pool.execute(
    `INSERT INTO provider_products 
    (item_number, name, provider_id, price, estimated_delivery_time, min_order_quantity, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      item_number,
      name,
      provider_id,
      price,
      estimated_delivery_time,
      min_order_quantity,
      is_active,
    ]
  );
};
const getProviderProductByIds = (item_number, provider_id) => {
  const sql = `SELECT * FROM provider_products WHERE item_number = ? AND provider_id = ?`;
  return pool.execute(sql, [item_number, provider_id]);
};
module.exports = {
  getAllProviderProducts,
  getProviderProductById,
  insertNewProviderProduct,
  getProviderProductByIds
};
