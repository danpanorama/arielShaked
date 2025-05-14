const products = require("../../models/product");

const deleteProductCompletelyController = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "לא סופק מזהה מוצר למחיקה." });
    }

    const [existingProduct] = await products.getProductsById(id);

    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "המוצר לא נמצא במערכת." });
    }

    const result = await products.deleteProductById(id);

    if (result[0].affectedRows === 0) {
      return res.status(500).json({ message: "מחיקה נכשלה. נסה שוב." });
    }

    return res.status(200).json({ message: "המוצר נמחק בהצלחה." });
  } catch (err) {
    console.error("שגיאה במחיקת מוצר לחלוטין:", err.message);
    return res.status(500).json({ message: "שגיאה כללית במחיקת מוצר." });
  }
};

module.exports = { deleteProductCompletelyController };
