const providersOrdersModel = require("../../../models/providerOrder");
const providers = require("../../../models/providers");



const providersOrdersController = async (req, res, next) => {
  try {
    // פרטי ההזמנה שמתקבלים מהבקשה
    const {
      provider_id,
      provider_name,
      category = "",
      price,
      estimated_delivery_time,
      items,
    } = req.body;

console.log(estimated_delivery_time)
    
   let getProviderDeliveryTime = await providers.getProvidersById(provider_id)

deliveryTime = getProviderDeliveryTime[0][0].delivery_time

    // בדיקה אם כל השדות הדרושים מולאו
    if (
      !provider_id ||
      !provider_name ||
      price === undefined ||
      !items ||
      !Array.isArray(items)
    ) {
      return res.status(400).json({
        error: "יש למלא את כל שדות ההזמנה כולל רשימת הפריטים.",
      });
    }

    // המרת המחיר למספר
    const priceAsNumber = parseFloat(price);
    if (isNaN(priceAsNumber)) {
      return res.status(400).json({
        error: "המחיר חייב להיות מספר תקין.",
      });
    }
// יצירת תאריך יצירה בהמרה לפורמט YYYY-MM-DD HH:MM:SS
let created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

// כאן אתה מפרק את תאריך ה-ISO כך שהוא יכיל רק את התאריך
created_at = created_at.split("T")[0];

let is_approved = 0;
const deliveryTimeInDays = Number(deliveryTime);
const estimatedDeliveryDate = new Date();
estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + deliveryTimeInDays);

// יצירת ההזמנה בספק
const insertOrderResult = await providersOrdersModel.insertProviderOrder(
  provider_id,
  provider_name,
  priceAsNumber,
  estimatedDeliveryDate.toISOString(), // או פשוט estimatedDeliveryDate
  created_at,
  0, 0, 0, 0
);

const orderId = insertOrderResult[0].insertId;
console.log(orderId);

// עבור כל פריט ברשימה, נבצע את הבדיקות וההכנסה
for (const item of items) {
  const { id, name, quantity, price } = item;

  // בדיקת שדות חובה
  if (!id || !name || quantity === undefined || price === undefined) {
    // מחיקת ההזמנה אם יש פריט חסר מידע
    await providersOrdersModel.deleteProviderOrderById(orderId);
    return res.status(400).json({
      error: "כל פריט חייב להכיל id, name, quantity ו-price.",
    });
  }

  // המרת המחיר של הפריט למספר
  const itemPrice = parseFloat(price);
  if (isNaN(itemPrice)) {
    // מחיקת ההזמנה אם המחיר לא תקין
    await providersOrdersModel.deleteProviderOrderById(orderId);
    return res.status(400).json({
      error: "מחיר הפריט חייב להיות מספר תקין.",
    });
  }

  console.log('here', orderId, id, name, quantity, itemPrice);
 


  // הכנסת פריט להזמנה
  await providersOrdersModel.insertProviderOrderItem(
    orderId,
    id,
    name,
    quantity,
    itemPrice
  );
}

// החזרת תשובה חיובית אחרי כל ההוספות
return res.json({
  message: "הזמנה נוצרה בהצלחה",
  order: {
    id: orderId,
    provider_id,
    provider_name,
    price: priceAsNumber,
    items,
    estimated_delivery_time:estimatedDeliveryDate.toISOString(),
    created_at,
    is_approved
  }
});

  } catch (err) {
    console.error("שגיאה ביצירת הזמנת ספק:", err.message);
    
    return res.status(500).json({
      error: "שגיאה ביצירת ההזמנה.",
    });
  }
};

module.exports.providersOrdersController = providersOrdersController;
