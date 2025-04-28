// const products = require("../../models/product");

// const deleteProductController = async (req, res) => {
//   try {
//     (req.body.productId)
//     const  id  = req.body.productId;
//     const  quantity  = req.body.quantity;
//     if (!id) {
//       return res.status(400).json({ message: "לא סופק מזהה מוצר למחיקה." });
//     }




//     const result = await products.deleteProductById(id);

//     if (result[0].affectedRows === 0) {
//       return res.status(404).json({ message: "המוצר לא נמצא." });
//     }

//     return res.status(200).json({ message: "המוצר נמחק בהצלחה." });
//   } catch (err) {
//     console.error("Error deleting product:", err.message);
//     return res.status(500).json({ message: "שגיאה בעת מחיקת המוצר." });
//   }
// };

// module.exports.deleteProductController = deleteProductController;
const products = require("../../models/product");

const deleteProductController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "חובה לספק מזהה מוצר וכמות למחיקה." });
    }

    // שלב 1: משוך את המוצר מה־DB
    const [rows] = await products.getProductsById(productId);

    if (rows.length === 0) {
      return res.status(404).json({ message: "המוצר לא נמצא." });
    }

    const product = rows[0];

    if (product.quantity > quantity) {
      // שלב 2: יש יותר מהמינון – נעדכן את הכמות
      const newQuantity = product.quantity - quantity;
      await products.updateProductQuantity(productId, newQuantity);
      return res.status(200).json({ message: "הכמות עודכנה בהצלחה." });
    } else {
      // שלב 3: כמות נמוכה או שווה – נמחוק את המוצר
      const result = await products.deleteProductById(productId);

      if (result[0].affectedRows === 0) {
        return res.status(404).json({ message: "המוצר לא נמצא למחיקה." });
      }

      return res.status(200).json({ message: "המוצר נמחק לגמרי כי הכמות שנדרשה הייתה שווה או יותר." });
    }
  } catch (err) {
    console.error("Error deleting/updating product:", err.message);
    return res.status(500).json({ message: "שגיאה כללית במחיקת/עדכון מוצר." });
  }
};

module.exports.deleteProductController = deleteProductController;
