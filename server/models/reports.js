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
      po.id,
      p.name AS provider_name,
      po.created_at,
      po.price,
      po.amount_paid,
      po.is_received,
      po.is_paid,
      po.is_approved
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
      COUNT(CASE WHEN is_received = 1 AND (is_paid = 0 OR amount_paid < price) THEN 1 END) AS unpaid_received_orders,
      SUM(CASE WHEN is_received = 1 AND (is_paid = 0 OR amount_paid < price) THEN (price - amount_paid) END) AS unpaid_received_total
    FROM provider_orders
    WHERE 
      is_approved = 1
      AND (
        is_received = 0
        OR (is_paid = 0 OR amount_paid < price)
      );
  `);
};


const selectBakerySummary = (where, params) => {
return pool.query(`
  SELECT 
    bakery_order_items.product_name AS product_name,
    COUNT(DISTINCT bakery_orders.id) AS total_orders,
    SUM(bakery_order_items.quantity) AS total_units
  FROM bakery_order_items 
  JOIN bakery_orders ON bakery_order_items.order_id = bakery_orders.id
  ${where}
  GROUP BY bakery_order_items.product_name
`, params);

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


module.exports = {
  selectInventoryZero,
  selectInventoryRemovalHistory,
  selectOpenOrders,
  selectOpenOrdersSummary,
  selectBakerySummary,
  selectAllOrders,
  selectInventoryWithdrawHistory,
  selectAveragePreparationTime  // <-- להוסיף כאן
};

