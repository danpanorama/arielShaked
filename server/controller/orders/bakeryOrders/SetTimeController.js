// const bakeryModel = require("../../../models/bakery");
// const products = require("../../../models/product");
// const SetTimeController = async (req, res) => {
//   try {
//     const io = req.app.get("io");
//     const { estimated_ready_time, order_id } = req.body;


//     if (!estimated_ready_time || !order_id) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     // עדכון זמן מוערך + אישור ההזמנה
//     await bakeryModel.updateEstimatedTime(order_id, estimated_ready_time);
//     await bakeryModel.approveOrder(order_id);  // עדכון is_approved ל-1

//     // שליפה של ההזמנה והפריטים
//     const [orders] = await bakeryModel.getBakeryOrderById(order_id);
//     const [items] = await bakeryModel.getBakeryOrderItemsByOrderId(order_id);

//     const fullOrder = {
//       ...orders[0],
//       items
//     };
// // הורדת מלאי לכל פריט בהזמנה
// for (const item of items) {
//   const productId = item.product_id || item.id;
//   const quantity = parseFloat(item.quantity);

//   if (!isNaN(quantity) && productId) {
//     await products.decreaseProductStock(productId, quantity);
//   }
// }



//     // שליחת ההזמנה המעודכנת בסוקט
//     io.emit("order-time-updated", fullOrder);

//     res.status(200).json({ message: "הזמן עודכן, ההזמנה אושרה ונשלחה ב-socket", fullOrder });
//   } catch (err) {
//     console.error("שגיאה בעדכון זמן:", err);
//     res.status(500).json({ message: "שגיאה בשרת" });
//   }
// };

// module.exports.SetTimeController = SetTimeController;


const bakeryModel = require("../../../models/bakery");
const products = require("../../../models/product");

const SetTimeController = async (req, res) => {
  try {
    const io = req.app.get("io");
    const {
      estimated_ready_time,
      order_id
    } = req.body;

  


 


    if (estimated_ready_time == null || order_id == null) {
      return res.status(400).json({
        message: "Missing data"
      });
    }


    // שליפה של ההזמנה והפריטים
    const [orders] = await bakeryModel.getBakeryOrderById(order_id);
    const [items] = await bakeryModel.getBakeryOrderItemsByOrderId(order_id);
 

    // בדיקת זמינות מלאי לכל פריט
    for (const item of items) {
      const productId = item.product_id || item.id;
      const quantity = parseFloat(item.quantity);
      if (!isNaN(quantity) && productId) {
        const [productRows] = await products.getProductsById(productId);
        const product = productRows[0];

        if (!product || product.quantity < quantity) {
          return res.status(400).json({
            error: {
              message: `אין מספיק מלאי למוצר: ${product ? product.name : "לא נמצא"}`
            }
          });
        }
      }
    }

    // עדכון זמן מוערך + אישור ההזמנה
    await bakeryModel.updateEstimatedTime(order_id, estimated_ready_time);
    await bakeryModel.approveOrder(order_id); // עדכון is_approved ל-1

    // הורדת מלאי לכל פריט
    for (const item of items) {
      const productId = item.product_id || item.id;
      const quantity = parseFloat(item.quantity);
      if (!isNaN(quantity) && productId) {
        await products.decreaseProductStock(productId, quantity);
      }
    }
    orders[0].estimated_ready_time = estimated_ready_time
    orders[0].is_approved = 1
    const fullOrder = {
      ...orders[0],
      items
    };

    // שליחת ההזמנה המעודכנת בסוקט
    io.emit("order-time-updated", fullOrder);

    res.status(200).json({
      message: "הזמן עודכן, ההזמנה אושרה ונשלחה ב-socket",
      fullOrder
    });
  } catch (err) {
    console.error("שגיאה בעדכון זמן:", err);
    res.status(500).json({
      message: "שגיאה בשרת"
    });
  }
};

module.exports.SetTimeController = SetTimeController;