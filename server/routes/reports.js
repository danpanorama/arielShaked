const express = require('express');
const router = express.Router();

const {
  getInventoryZeroReport,
  getInventoryWithdrawHistory,
  getOpenOrdersReport,
  getBakerySummaryReport
} = require('../controller/reports/reportsController');

// דוח מלאי

router.get('/inventory-zero', getInventoryZeroReport);

router.get('/removal-history-chart', getInventoryWithdrawHistory);


// דוח הזמנות פתוחות
router.get('/open-orders', getOpenOrdersReport);

// דוח סיכום הזמנות אפייה
router.get('/bakery-summary', getBakerySummaryReport);

module.exports = router;
