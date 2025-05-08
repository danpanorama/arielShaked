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
    const [rows] = await products.getProductsById(productId);

    if (rows.length === 0) {
      return res.status(404).json({ message: "המוצר לא נמצא." });
    }
    const product = rows[0];
    const currentQuantity = Number(product.quantity);
    const deleteQuantity = Number(quantity);
    
    if (currentQuantity > deleteQuantity) {
      const newQuantity = currentQuantity - deleteQuantity; 
      console.log(productId,newQuantity)
      await products.updateProductQuantity(newQuantity,productId);
      console.log('done')
      return res.status(200).json({ message: "הכמות עודכנה בהצלחה." });
    } else {
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
