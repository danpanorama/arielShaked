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
  provider_name,
  provider_id,
  price,

  min_order_quantity,
  is_active
) => {
  return pool.execute(
    `INSERT INTO provider_products 
    (item_number, name,provider_name, provider_id, price,  min_order_quantity, is_active)
    VALUES (?,?, ?, ?, ?, ?, ?)`,
    [
      item_number,
      name,
      provider_name,
      provider_id,
      price,
  
      min_order_quantity,
      is_active,
    ]
  );
};
const getProviderProductByIds = ( provider_id) => {
  const sql = `SELECT * FROM provider_products WHERE  provider_id = ?`;
  return pool.execute(sql, [ provider_id]);
};

const getProvidersByProductId  = ( item_number) => {
  const sql = `SELECT * FROM provider_products WHERE item_number = ?`;
  return pool.execute(sql, [ item_number]);
};



const deleteAllProductsFromProvider = async (providerId) => {
  const sql = "DELETE FROM provider_products WHERE provider_id = ?";
  return await pool.execute(sql, [providerId]);
};


const changeStatus = (status,id) => {
  return pool.execute(
    `UPDATE provider_products SET is_active = ? WHERE id = ?`,
    [status,id]
  );
};

module.exports = {
  getAllProviderProducts,
  getProviderProductById,
  insertNewProviderProduct,
  getProviderProductByIds,
  getProvidersByProductId,
  deleteAllProductsFromProvider,
  changeStatus // הוספת הפונקציה כאן
};
