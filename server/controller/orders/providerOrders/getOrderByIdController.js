

  const mysql = require("../../../models/providerOrder");


const getOrderByIdController = async (req, res) => {
  const { orderId } = req.params;

  try {
    const [orderRows] = await mysql.getOrderById(orderId);
    const [itemsRows] = await mysql.getOrderItemsByOrderId(orderId);

    if (orderRows.length === 0) return res.status(404).json({ message: "ההזמנה לא נמצאה" });

    const order = orderRows[0];
    order.items = itemsRows;

    res.json(order);
  } catch (err) {
    console.error("שגיאה בשליפת פרטי ההזמנה:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};


module.exports.getOrderByIdController = getOrderByIdController;
