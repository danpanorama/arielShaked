const {
  selectInventoryZero,
  selectOpenOrders,
  selectOpenOrdersSummary,
  selectBakerySummary
} = require('../../models/reports');

// דוח מלאי 0
const getInventoryZeroReport = async (req, res) => {
  try {
    const [results] = await selectInventoryZero();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// דוח הזמנות פתוחות
const getOpenOrdersReport = async (req, res) => {
  try {
    const [orders] = await selectOpenOrders();
    
    const [summary] = await selectOpenOrdersSummary();
    res.json({ orders, summary: summary[0] });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};


// דוח סיכום הזמנות אפייה
const getBakerySummaryReport = async (req, res) => {
  try {
    const { from, to, product } = req.body;  // <-- כאן

    let where = 'WHERE 1=1';
    const params = [];

    if (from && to) {
      where += ' AND bakery_orders.order_date BETWEEN ? AND ?';
      params.push(from, to);
    }

    if (product) {
      where += ' AND bakery_order_items.product_name = ?';
      params.push(product);
    }

    const [summary] = await selectBakerySummary(where, params);

    res.json(summary);
  } catch (err) {
    console.error('Error in getBakerySummaryReport:', err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  getInventoryZeroReport,
  getOpenOrdersReport,
  getBakerySummaryReport,
};
