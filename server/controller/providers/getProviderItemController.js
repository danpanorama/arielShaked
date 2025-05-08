const { getProviderProductByIds } = require("../../models/ProductProvider");

const getProviderItemController = async (req, res, next) => {
  try {
    console.log(req.body)
    const providerId = req.body.providerId;
   

    if (!providerId) {
      return res.status(400).json({ error: "חסר מזהה ספק (providerId)" });
    }

    // שליפת המוצרים עבור הספק לפי providerId
    const [items] = await getProviderProductByIds( providerId);  // מבצע שליפה לפי providerId

    
    if (items.length === 0) {
      return res.status(404).json({ message: "לא נמצאו מוצרים עבור ספק זה" });
    }

    return res.status(200).json({ items });
  } catch (err) {
    console.error("שגיאה בשליפת פרטי הספק:", err);
    return res.status(500).json({ error: "שגיאה פנימית בשרת" });
  }
};

module.exports = getProviderItemController;
