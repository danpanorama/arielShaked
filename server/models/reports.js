const pool = require("../models/mysql2");

// דוח מלאי 0
const selectInventoryZero = () => {
  return pool.query(`
    SELECT * FROM products 
    WHERE is_active = TRUE AND (quantity = 0 OR quantity < min_required)
  `);
};

// דוח הזמנות פתוחות
const selectOpenOrders = () => {
  return pool.query(`
    SELECT 
      po.id,
      p.name AS provider_name,
      po.created_at,
      po.price,
      po.amount_paid,
      po.is_received,
      po.is_paid
    FROM provider_orders po
    JOIN providers p ON po.provider_id = p.id
    WHERE po.is_approved = TRUE AND (po.is_paid = FALSE OR po.amount_paid < po.price)
  `);
};
const selectAllOrders = () => {
  return pool.query(`
    SELECT 
      po.id AS orderId,
      p.name AS provider_name,
      po.created_at,
      po.price,
      po.amount_paid,
      po.is_received,
      po.is_paid
     
    FROM provider_orders po
    JOIN providers p ON po.provider_id = p.id
  `);
};



const selectOpenOrdersSummary = () => {
  return pool.query(`
    SELECT 
      COUNT(*) AS total_open_orders,
      SUM(price) AS total_order_value,
      SUM(amount_paid) AS total_paid,
      SUM(price - amount_paid) AS total_remaining_to_pay,
      COUNT(CASE WHEN is_received = 1 AND ( amount_paid < price) THEN 1 END) AS unpaid_received_orders,
      SUM(CASE WHEN is_received = 1 AND ( amount_paid < price) THEN (price - amount_paid) END) AS unpaid_received_total
    FROM provider_orders
    WHERE 
      is_approved = 1
      AND (
        is_received = 0

        OR ( amount_paid < price)  
      );
  `);
};

const selectUnapprovedOrdersSummary = () => {
  return pool.query(`
    SELECT 
      COUNT(*) AS total_unapproved_orders,
      SUM(price) AS total_order_value,
      SUM(amount_paid) AS total_paid,
      SUM(price - amount_paid) AS total_remaining_to_pay
    FROM provider_orders
    WHERE is_approved = 0;
  `);
};




const selectBakerySummary = (where, params) => {
  return pool.query(`
    SELECT 
      boi.product_name AS product_name,
      COUNT(DISTINCT bo.id) AS total_orders,
      CONCAT(SUM(boi.quantity), ' ', p.unit) AS total_units_with_unit
    FROM bakery_order_items boi
    JOIN bakery_orders bo ON boi.order_id = bo.id
    JOIN products p ON boi.product_id = p.id
    ${where}
    GROUP BY boi.product_name, p.unit
    ORDER BY boi.product_name
  `, params);
};



const selectBakeryOrdersBetweenDates = (startDate, endDate) => {
  return pool.query(`
    SELECT 
      boi.product_name AS product_name,
      COUNT(DISTINCT bo.id) AS total_orders,
      CONCAT(SUM(boi.quantity), ' ', p.unit) AS total_units_with_unit
    FROM bakery_order_items boi
    JOIN bakery_orders bo ON boi.order_id = bo.id
    JOIN products p ON boi.product_id = p.id
    WHERE bo.order_date BETWEEN ? AND ?
    GROUP BY boi.product_name, p.unit
    ORDER BY boi.product_name
  `, [startDate, endDate]);
};





const selectAveragePreparationTime = (where, params) => {
  return pool.query(`
    SELECT AVG(TIMESTAMPDIFF(SECOND, ordered_at, ready_at)) AS avg_preparation_seconds
    FROM bakery_orders
    ${where}
  `, params);
};

const selectInventoryWithdrawHistory = () => {
  return pool.query(`
    SELECT
      product_id,
      product_name,
      quantity_removed AS quantity,
      removal_reason AS reason,
      removed_at AS withdrawn_at
    FROM product_removal_history
    ORDER BY removed_at DESC
  `);
};

const selectInventoryRemovalHistory = () => {
  const query = `
    SELECT reason, COUNT(*) as count
    FROM product_removal_history
    GROUP BY reason
  `;
  return connection.query(query);
};

const selectProductRemovalsBetweenDates = (startDate, endDate) => {
  return pool.query(`
    SELECT 
      product_id,
      product_name,
      quantity_removed AS quantity,
      removal_reason AS reason,
      DATE_FORMAT(removed_at, '%Y-%m-%d %H:%i:%s') AS withdrawn_at
    FROM product_removal_history
    WHERE DATE(removed_at) BETWEEN ? AND ?
    ORDER BY removed_at DESC
  `, [startDate, endDate]);
};





module.exports = {
  selectInventoryZero,
  selectUnapprovedOrdersSummary,
  selectInventoryRemovalHistory,
  selectProductRemovalsBetweenDates,
  selectOpenOrders,
  selectOpenOrdersSummary,
  selectBakerySummary,
  selectAllOrders,
  selectInventoryWithdrawHistory,
  selectBakeryOrdersBetweenDates,
  selectAveragePreparationTime  // <-- להוסיף כאן
};

