const express = require('express');
const router = express.Router();

const {
  getInventoryZeroReport,
  getOpenOrdersReport,
  getBakerySummaryReport
} = require('../controller/reports/reportsController');

// דוח מלאי
router.get('/inventory-zero', getInventoryZeroReport);

// דוח הזמנות פתוחות
router.get('/open-orders', getOpenOrdersReport);

// דוח סיכום הזמנות אפייה
router.get('/bakery-summary', getBakerySummaryReport);

module.exports = router;
