const mysql = require("../../../models/providerOrder");
const productsDB = require("../../../models/product");
const approve_order = async (req, res) => {
  const { orderId, items } = req.body;

  try {
    const [orderRows] = await mysql.getOrderById(orderId);
    if (orderRows.length === 0) return res.status(404).json({ message: "ההזמנה לא נמצאה" });

    const order = orderRows[0];

    // עדכון סטטוסים
    await mysql.updateOrderApprovalStatus(orderId, 1);
    await mysql.updateEstimatedDeliveryTime(orderId, new Date());
    await mysql.updateOrderReceivedStatus(orderId, 1);

    // עבור כל פריט שנשלח מהקליינט:
    for (const item of items) {
      const productId = item.product_id;
      const receivedQty = Number(item.quantity); // מה שהגיע בפועל

      // עדכון שדה received_quantity בטבלת ההזמנות
      await mysql.updateOrderItemReceivedQuantity(orderId, productId, receivedQty);

      // עדכון מלאי בטבלת products
      const [productRows] = await productsDB.getProductsById(productId);
      if (productRows.length === 0) {
        console.warn(`מוצר לא נמצא: ${productId}`);
        continue;
      }

      const newStock = Number(productRows[0].quantity) + receivedQty;
      await productsDB.updateProductQuantity(newStock, productId);
    }

    // החזרת ההזמנה + הפריטים לאחר עדכון
    const [updatedItems] = await mysql.getOrderItemsByOrderId(orderId);
    order.items = updatedItems;

    res.json({ message: "ההזמנה אושרה והמלאי עודכן", order });
  } catch (err) {
    console.error("שגיאה באישור ההזמנה:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

module.exports.approve_order = approve_order;
