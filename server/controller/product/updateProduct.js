const products = require("../../models/products");

const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, unit, min_required, is_active } = req.body;

    if (!id || !name || !category || quantity === undefined || !unit || min_required === undefined || is_active === undefined) {
      return res.status(400).json({ message: "יש למלא את כל השדות כולל מזהה מוצר." });
    }

    const result = await products.updateProduct(id, name, category, quantity, unit, min_required, is_active);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "המוצר לא נמצא." });
    }

    return res.status(200).json({ message: "המוצר עודכן בהצלחה." });
  } catch (err) {
    console.error("Error updating product:", err.message);
    return res.status(500).json({ message: "שגיאה בעת עדכון המוצר." });
  }
};

module.exports.updateProductController = updateProductController;
