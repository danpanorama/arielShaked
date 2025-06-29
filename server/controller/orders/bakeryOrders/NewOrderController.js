const bakeryModel = require("../../../models/bakery"); // עדכן לפי הצורך
// const NewOrderController = async (req, res) => {
//   try {
//     const {
//       estimated_ready_time,
//       is_approved,
//       is_delivered,
//       category,
//       items,
//     } = req.body;
  

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({
//         error: "נא למלא את כל השדות הנדרשים כולל פריטים להזמנה.",
//       });
//     }

//   const order_date = new Date().toISOString();


//     // יצירת הזמנה ראשית בטבלה
//     const insertResult = await bakeryModel.insertBakeryOrder(
//       order_date,
//       null,
//       is_approved,
//       category,
//       1
//     );

//     const orderId = insertResult[0].insertId;

//     // הכנסת פריטים להזמנה
//     for (const item of items) {
//       const {
//         id,
//         name,
//         quantity,
//         unit
//       } = item;

//       if (!id || !name || quantity === undefined) {
//         await bakeryModel.deleteBakeryOrder(orderId);
//         return res.status(400).json({
//           error: "כל פריט חייב להכיל id, name ו-quantity.",
//         });
//       }

//       await bakeryModel.insertBakeryOrderItem(
//         orderId,
//         id,
//         name,
//         quantity,
//         unit
//       );
//     }

//     // משיכת ההזמנה עם כל הפריטים כדי להחזיר ללקוח
//   const order = await bakeryModel.getBakeryOrderById(orderId);
//   const orderItems = await bakeryModel.getBakeryOrderItemsByOrderId(orderId);
//   order[0][0].items = orderItems[0]
//   const allorder = order[0][0]


//     const io = req.app.get('io');
//     if (io) {
//       console.log(allorder, "::::::::::::::::::")
//       io.emit('newOrder', {
//         message: "הזמנה חדשה נוצרה",
//         order: allorder,
//         orderItems: orderItems
//       });
//     }

//     return res.json({
//       message: "הזמנה נוצרה בהצלחה",
//       order,
//       items: orderItems,
//     });

//   } catch (err) {
//     console.error("שגיאה ביצירת ההזמנה:", err.message);
//     return res.status(500).json({
//       error: "שגיאה ביצירת ההזמנה.",
//     });
//   }
// };


const NewOrderController = async (req, res) => {
  try {
    const {
      estimated_ready_time,
      is_approved,
      is_delivered,
      category,
      items,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "נא למלא את כל השדות הנדרשים כולל פריטים להזמנה.",
      });
    }

    const ordered_at = new Date(); // תאריך ושעה מדויקים של ההזמנה

    // יצירת הזמנה ראשית בטבלה עם זמן מדויק
    const insertResult = await bakeryModel.insertBakeryOrder(
      ordered_at,
      ordered_at, // ordered_at
      null,      // ready_at עדיין לא קיים
      null,
      is_approved,
      category,
      is_delivered
    );

    const orderId = insertResult[0].insertId;

    // הכנסת פריטים להזמנה
    for (const item of items) {
      const {
        id,
        name,
        quantity,
        unit
      } = item;

      if (!id || !name || quantity === undefined) {
        await bakeryModel.deleteBakeryOrder(orderId);
        return res.status(400).json({
          error: "כל פריט חייב להכיל id, name ו-quantity.",
        });
      }

      await bakeryModel.insertBakeryOrderItem(
        orderId,
        id,
        name,
        quantity,
        unit
      );
    }

    // משיכת ההזמנה עם כל הפריטים כדי להחזיר ללקוח
    const order = await bakeryModel.getBakeryOrderById(orderId);
    const orderItems = await bakeryModel.getBakeryOrderItemsByOrderId(orderId);
    order[0][0].items = orderItems[0];
    const allorder = order[0][0];

    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', {
        message: "הזמנה חדשה נוצרה",
        order: allorder,
        orderItems: orderItems
      });
    }

    return res.json({
      message: "הזמנה נוצרה בהצלחה",
      order,
      items: orderItems,
    });

  } catch (err) {
    console.error("שגיאה ביצירת ההזמנה:", err.message);
    return res.status(500).json({
      error: "שגיאה ביצירת ההזמנה.",
    });
  }
};

module.exports.NewOrderController = NewOrderController;