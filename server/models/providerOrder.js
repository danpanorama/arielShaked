const pool = require("./mysql2");

// קבלת כל ההזמנות מהספקים
const getAllProviderOrders = () => {
  return pool.execute(`SELECT * FROM provider_orders ORDER BY created_at DESC`);
};
const checkProductExists = (productId) => {
  return pool.execute(
    `SELECT * FROM products WHERE id = ?`,
    [productId]
  );
};

const getOrderById = (order_id) => {
  return pool.execute("SELECT * FROM provider_orders WHERE id = ?", [order_id]);
};

const getOrderItemsByOrderId = (order_id) => {
  return pool.execute("SELECT * FROM provider_order_items WHERE order_id = ?", [order_id]);
};
  
const getUnapprovedOrders = () => {
  const query = `
    SELECT o.id, o.provider_name AS providerName, o.created_at,o.price
    FROM provider_orders o
    WHERE o.is_approved = 0
  `;
  return pool.execute(query);
};
const updateOrderReceivedStatus = (orderId, isReceived) => {
  return pool.execute(
    `UPDATE provider_orders SET is_received = ? WHERE id = ?`,
    [isReceived, orderId]
  );
};



const insertProviderOrder = (
  provider_id,
  provider_name,
  price,
  estimated_delivery_time,
  created_at,
  is_approved,
  is_paid,
  amount_paid,
  is_received
) => {
  return pool.execute(
    `INSERT INTO provider_orders 
     (provider_id, provider_name, price, estimated_delivery_time, created_at,is_approved,is_paid,amount_paid,is_received) 
     VALUES (?, ?, ?, ?, ?,?,?,?,?)`,
    [provider_id, provider_name, price, estimated_delivery_time ?? null, created_at,is_approved,is_paid,amount_paid,is_received]
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

const updateOrderItemReceivedQuantity = (orderId, productId, receivedQty) => {
  return pool.execute(
    `UPDATE provider_order_items 
     SET received_quantity = ? 
     WHERE order_id = ? AND product_id = ?`,
    [receivedQty, orderId, productId]
  );
};

const updateOrderPayment = (orderId, amountPaid) => {
  return pool.execute(
    `UPDATE provider_orders 
     SET amount_paid = ?, is_paid = CASE WHEN ? >= price THEN 1 ELSE 0 END 
     WHERE id = ? AND is_approved = 1`,
    [amountPaid, amountPaid, orderId]
  );
};

module.exports = {
  getAllProviderOrders,
  insertProviderOrder,
  updateOrderApprovalStatus,
  updateEstimatedDeliveryTime,
  deleteProviderOrderById,
  insertProviderOrderItem,
  checkProductExists,
  getOrderById,
  getOrderItemsByOrderId,
  getUnapprovedOrders,
  updateOrderReceivedStatus,
  updateOrderItemReceivedQuantity,
  updateOrderPayment
};
