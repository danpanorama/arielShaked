const mysql = require("../../../models/providerOrder");

const getUnapprovedOrders = async (req, res) => {
  try {
    // שליפת כל ההזמנות שלא אושרו
    const [orders] = await mysql.getUnapprovedOrders(); // כאן נשתמש בפונקציה חדשה ממודל

    // מביאים לכל הזמנה את הפריטים שלה
    for (let order of orders) {
      const [items] = await mysql.getOrderItemsByOrderId(order.id);
      order.items = items;
    }

    res.json({ orders });
  } catch (err) {
    console.error("שגיאה בשליפת הזמנות לא מאושרות:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

module.exports.getUnapprovedOrders = getUnapprovedOrders;
