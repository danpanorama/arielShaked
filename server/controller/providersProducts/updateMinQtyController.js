const ProductProvider = require("../../models/ProductProvider");

const updateMinQtyController = async (req, res) => {
  try {
    const { productId, minQty } = req.body;
    console.log("Body:", req.body);

    if (!productId || !minQty || minQty <= 0) {
      return res.status(400).json({ message: "שגיאה: מזהה מוצר או כמות מינימלית חסרים/שגויים" });
    }

    const result = await ProductProvider.updateMinQty(minQty, productId);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "המוצר לא נמצא." });
    }

    return res.status(200).json({ message: "כמות מינימלית עודכנה בהצלחה." });
  } catch (err) {
    console.error("Error updating min quantity:", err.message);
    return res.status(500).json({ message: "שגיאה בעת עדכון כמות מינימלית." });
  }
};

module.exports.updateMinQtyController = updateMinQtyController;
