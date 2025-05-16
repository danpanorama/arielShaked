const mysql = require("../../../models/providerOrder");

const updatePaymentController = async (req, res) => {
  const {
    orderId,
    amountPaid
  } = req.body;

  try {
    const [orderRows] = await mysql.getOrderById(orderId);

    if (!orderRows.length) {
      return res.status(404).json({
        message: "ההזמנה לא נמצאה"
      });
    }

    const order = orderRows[0];

    if (order.is_approved !== 1) {
      return res.status(400).json({
        message: "לא ניתן לעדכן תשלום להזמנה שלא אושרה"
      });
    }


    if (order.price < amountPaid) {
      return res.status(400).json({
        message: "התשלום גבוה מידי להזמנה "
      });
    }
    const allPayments = order.amount_paid + amountPaid
    if (order.price < allPayments) {
      return res.status(400).json({
        message: "התשלום גבוה מידי להזמנה "
      });
    }

    await mysql.updateOrderPayment(orderId, allPayments);

    return res.status(200).json({
      message: "התשלום עודכן בהצלחה"
    });

  } catch (err) {
    console.error("שגיאה בעדכון תשלום:", err);
    return res.status(500).json({
      message: "שגיאה פנימית בשרת"
    });
  }
};
module.exports.updatePaymentController = updatePaymentController;