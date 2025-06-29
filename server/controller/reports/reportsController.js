const {
  selectInventoryZero,
  selectOpenOrders,
  selectAllOrders,
  selectOpenOrdersSummary,
  selectAveragePreparationTime,
  selectBakerySummary,
  selectUnapprovedOrdersSummary
} = require('../../models/reports');
const {
getAllProducts
} = require('../../models/product');
// דוח מלאי 0
const getInventoryZeroReport = async (req, res) => {
  try {
    const [results] = await selectInventoryZero();
const [products] = await getAllProducts();



    res.json({data:results,products:products});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
// דוח הזמנות פתוחות
const getOpenOrdersReport = async (req, res) => {
  try {
    const [orders] = await selectAllOrders();
    const [unApproveOrder] = await selectUnapprovedOrdersSummary()
    
    const [summary] = await selectOpenOrdersSummary();  
    res.json({ orders, summary: summary[0],unApproveOrder:unApproveOrder });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};


// דוח סיכום הזמנות אפייה
const getBakerySummaryReport = async (req, res) => {
  try {
    const { product } = req.query; // לא מבקש תאריכים

    let where = 'WHERE 1=1';
    const params = [];

    // אם רוצים סינון לפי מוצר (אפשר להשאיר או למחוק)
    if (product) {
      where += ' AND bakery_order_items.product_name = ?';
      params.push(product);
    }

    // לא מוסיפים סינון לפי תאריכים => מחזיר הכל

    const [summary] = await selectBakerySummary(where, params);
    const [avgTimeResult] = await selectAveragePreparationTime(where, params);

    const avgSeconds = avgTimeResult[0]?.avg_preparation_seconds || 0;

    const hours = Math.floor(avgSeconds / 3600);
    const minutes = Math.floor((avgSeconds % 3600) / 60);
    const seconds = Math.floor(avgSeconds % 60);
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;
console.log({
      summary,
      average_preparation_time: formattedTime,
      average_seconds: avgSeconds,
    })
    res.json({
      summary,
      average_preparation_time: formattedTime,
      average_seconds: avgSeconds,
    });
  } catch (err) {
    console.error('Error in getBakerySummaryReport:', err);
    res.status(500).json({ error: err.message });
  }
};


const { selectInventoryWithdrawHistory } = require('../../models/reports');
function formatDate(dateString) {
  const date = new Date(dateString);
  // שנה תאריך לפורמט yyyy-mm-dd hh:mm:ss
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // חודשים מתחילים מ-0
  const dd = String(date.getDate()).padStart(2, '0');

  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}


const getInventoryWithdrawHistory = async (req, res) => {
  try {
    const [results] = await selectInventoryWithdrawHistory();

    // שינוי הפורמט לכל רשומה
    const formattedResults = results.map(item => ({
      ...item,
      withdrawn_at: formatDate(item.withdrawn_at),
    }));

    res.json({ history: formattedResults });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getInventoryZeroReport,
  getOpenOrdersReport,
  getBakerySummaryReport,
  getInventoryWithdrawHistory
};
