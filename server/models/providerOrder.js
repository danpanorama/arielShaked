const pool = require("./mysql2");

// קבלת כל ההזמנות מהספקים
const getAllProviderOrders = () => {
  return pool.execute(`SELECT * FROM provider_orders ORDER BY created_at DESC`);
};


const insertProviderOrder = (provider_id, provider_name, category, price, estimated_delivery_time) => {
  return pool.execute(
    `INSERT INTO provider_orders 
     (provider_id, provider_name, category, price, estimated_delivery_time) 
     VALUES (?, ?, ?, ?, ?)`,
    [provider_id, provider_name, category, price, estimated_delivery_time]
  );
};
const insertProviderOrderItem = (order_id, product_id, product_name, quantity, unit_price) => {
  return pool.execute(
    `INSERT INTO provider_order_items 
     (order_id, product_id, product_name, quantity, unit_price) 
     VALUES (?, ?, ?, ?, ?)`,
    [order_id, product_id, product_name, quantity, unit_price]
  );
};

// עדכון סטטוס אישור ההזמנה
const updateOrderApprovalStatus = (orderId, isApproved) => {
  return pool.execute(
    `UPDATE provider_orders SET is_approved = ? WHERE id = ?`,
    [isApproved, orderId]
  );
};

// עדכון זמן אספקה מוערך
const updateEstimatedDeliveryTime = (orderId, estimatedTime) => {
  return pool.execute(
    `UPDATE provider_orders SET estimated_delivery_time = ? WHERE id = ?`,
    [estimatedTime, orderId]
  );
};

// מחיקת הזמנת ספק לפי ID
const deleteProviderOrderById = (orderId) => {
  return pool.execute(
    `DELETE FROM provider_orders WHERE id = ?`,
    [orderId]
  );
};

module.exports = {
  getAllProviderOrders,
  insertProviderOrder,
  updateOrderApprovalStatus,
  updateEstimatedDeliveryTime,
  deleteProviderOrderById,
  insertProviderOrderItem
};
