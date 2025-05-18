const db = require('../../models/providerOrder'); // קבצי שאילתות

const providerOrder = async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'אין פריטים בהזמנה' });
    }

    const { provider_id, provider_name, price, estimated_delivery_time } = items[0];

    // הכנסה להזמנת ספק חדשה
    const [orderResult] = await db.insertProviderOrder(
      provider_id,
      provider_name,
      null, // אין קטגוריה פה כרגע
      price,
      estimated_delivery_time
    );

    const order_id = orderResult.insertId;

    // הכנסה לפירוט הזמנה (items)
    for (const item of items) {
      await db.insertProviderOrderItem(
        order_id,
        item.id,              // product_id
        item.name,            // product_name
        item.quantity,        // quantity
        item.price            // unit_price
      );
    }

   

    res.status(201).json({estimated_delivery_time:estimated_delivery_time, message: 'ההזמנה נוצרה בהצלחה', order_id });

  } catch (err) {
    console.error('שגיאה ביצירת הזמנת ספק:', err);
    res.status(500).json({ error: 'אירעה שגיאה בשרת' });
  }
};

module.exports.providerOrder = providerOrder;
