const express = require('express');
const router = express.Router();

const {
  getInventoryZeroReport,
  getInventoryWithdrawHistory,
  getOpenOrdersReport,
  getBakerySummaryReport,
  getBakeryOrdersByDateRange,
  gethistoryByDateRange
} = require('../controller/reports/reportsController');

// דוח מלאי

router.get('/inventory-zero', getInventoryZeroReport);

router.get('/removal-history-chart', getInventoryWithdrawHistory);

router.post('/removal-history-chart-bet', gethistoryByDateRange);
// דוח הזמנות פתוחות
router.get('/open-orders', getOpenOrdersReport);


router.post('/bakery-time-order', getBakeryOrdersByDateRange); 
// דוח סיכום הזמנות אפייה
router.get('/bakery-summary', getBakerySummaryReport);

module.exports = router;
