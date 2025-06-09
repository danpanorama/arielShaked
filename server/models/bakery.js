const pool = require("./mysql2");

// קבלת כל ההזמנות
const getAllBakeryOrders = () => {
  return pool.execute(`SELECT * FROM bakery_orders `);
};

// קבלת הזמנה לפי ID
const getBakeryOrderById = (orderId) => {
  return pool.execute(`SELECT * FROM bakery_orders WHERE id = ?`, [orderId]);
};

// קבלת פריטים לפי מזהה הזמנה
const getBakeryOrderItemsByOrderId = (orderId) => {
  return pool.execute(`SELECT * FROM bakery_order_items WHERE order_id = ?`, [orderId]);
};
const insertBakeryOrder = (
  order_date,
  estimated_ready_time_formatted,
  is_approved,
  category,
  is_delivered
) => {
  return pool.execute(
    `INSERT INTO bakery_orders 
     (order_date, estimated_ready_time, is_approved, category, is_delivered)
     VALUES (?, ?, ?, ?, ?)`,
    [
      order_date,
      estimated_ready_time_formatted,
      is_approved,
      category,
      is_delivered
    ]
  );
};


// הכנסת פריט להזמנה
const insertBakeryOrderItem = (order_id, product_id, product_name, quantity, unit) => {
  return pool.execute(
    `INSERT INTO bakery_order_items 
     (order_id, product_id, product_name, quantity, unit)
     VALUES (?, ?, ?, ?, ?)`,
    [order_id, product_id, product_name, quantity, unit]
  );
};

// עדכון סטטוס אישור
const updateBakeryOrderApproval = (orderId, isApproved) => {
  return pool.execute(
    `UPDATE bakery_orders SET is_approved = ? WHERE id = ?`,
    [isApproved, orderId]
  );
};

// עדכון סטטוס תשלום
const updateBakeryOrderPayment = (orderId, amountPaid) => {
  return pool.execute(
    `UPDATE bakery_orders 
     SET amount_paid = ?, is_paid = CASE WHEN ? >= amount_paid THEN 1 ELSE 0 END
     WHERE id = ? AND is_approved = 1`,
    [amountPaid, amountPaid, orderId]
  );
};

// עדכון סטטוס אספקה
const updateBakeryOrderDeliveryStatus = (orderId, isDelivered) => {
  return pool.execute(
    `UPDATE bakery_orders SET is_delivered = ? WHERE id = ?`,
    [isDelivered, orderId]
  );
};

// עדכון כמות שהתקבלה של פריט
const updateBakeryItemReceivedQuantity = (orderId, productId, receivedQuantity) => {
  return pool.execute(
    `UPDATE bakery_order_items
     SET received_quantity = ?
     WHERE order_id = ? AND product_id = ?`,
    [receivedQuantity, orderId, productId]
  );
};

// מחיקת הזמנה
const deleteBakeryOrder = (orderId) => {
  return pool.execute(`DELETE FROM bakery_orders WHERE id = ?`, [orderId]);
};


// עדכון זמן מוערך של הזמנה
const updateEstimatedTime = (orderId, estimatedTime) => {
  return pool.execute(
    `UPDATE bakery_orders SET estimated_ready_time = ? WHERE id = ?`,
    [estimatedTime, orderId]
  );
};


const approveOrder = (orderId) => {
  return pool.execute(
    `UPDATE bakery_orders SET is_approved = 1 WHERE id = ?`,
    [orderId]
  );
};


const finishOrder = (order_id) => {
  return pool.execute(
    `UPDATE bakery_orders SET is_finished = 1 WHERE id = ?`,
    [order_id]
  );
};


module.exports = {
  getAllBakeryOrders,
  getBakeryOrderById,
  getBakeryOrderItemsByOrderId,
  insertBakeryOrder,
  insertBakeryOrderItem,
  updateBakeryOrderApproval,
  updateBakeryOrderPayment,
  updateBakeryOrderDeliveryStatus,
  updateBakeryItemReceivedQuantity,
  deleteBakeryOrder,
  updateEstimatedTime,
  approveOrder,
  finishOrder
};
