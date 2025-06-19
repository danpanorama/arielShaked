const bakeryModel = require("../../../models/bakery");
const products = require("../../../models/product");

const UpdateTimeDeliver = async (req, res) => {
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

    // עדכון זמן מוערך + אישור ההזמנה
    await bakeryModel.updateEstimatedTime(order_id, estimated_ready_time);
    orders[0].estimated_ready_time = estimated_ready_time
    const fullOrder = {
      ...orders[0],
      items
    };

    // שליחת ההזמנה המעודכנת בסוקט
    io.emit("order-time-updated-update", fullOrder);

    res.status(200).json({
      message: "הזמן עודכן, ההזמנה אושרה ונשלחה ב-socket",
      fullOrder
    });
  } catch (err) {
    console.error("שגיאה בעדכון זמן:", err);
    res.status(500).json({
     error:{data:{ message: "שגיאה בשרת"}}
    });
  }
};

module.exports.UpdateTimeDeliver = UpdateTimeDeliver;