const bakeryModel = require("../../../models/bakery");

// const FinishOrder = async (req, res) => {
//   try {
//     const io = req.app.get("io");
//     const { order } = req.body;
//     console.log(req.body)

//     if (!order || !order.id) {
//       return res.status(400).json({ message: "חסר מזהה הזמנה" });
//     }

//     const orderId = order.id;

//     // סימון ההזמנה כהושלמה במסד נתונים
//     await bakeryModel.finishOrder(orderId);

//     // עדכון האובייקט שנשלח ללקוח ולסוקט
//     const finishedOrder = {
//       ...order,
//       is_finished: 1
//     };

//     // שליחת הזמנה מעודכנת דרך socket
//     io.emit("order-finished", finishedOrder);

//     // תשובה לקליינט
//     res.status(200).json({
//       message: "ההזמנה סומנה כהושלמה ונשלחה ללקוחות דרך socket",
//       order: finishedOrder
//     });

//   } catch (err) {
//     console.error("שגיאה בסיום הזמנה:", err);
//     res.status(500).json({ message: "שגיאה בשרת" });
//   }
// };

const FinishOrder = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { order } = req.body;

    if (!order || !order.id) {
      return res.status(400).json({ message: "חסר מזהה הזמנה" });
    }

    const orderId = order.id;
    const ready_at = new Date(); // זמן סיום מדויק

    // עדכון ההזמנה כסיימה + שמירת ready_at
    await bakeryModel.finishOrder(orderId, ready_at);

    // עדכון האובייקט שנשלח ללקוח ולסוקט
    const finishedOrder = {
      ...order,
      is_finished: 1,
      ready_at
    };

    io.emit("order-finished", finishedOrder);

    res.status(200).json({
      message: "ההזמנה סומנה כהושלמה ונשלחה ללקוחות דרך socket",
      order: finishedOrder
    });

  } catch (err) {
    console.error("שגיאה בסיום הזמנה:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

module.exports.FinishOrder = FinishOrder;
