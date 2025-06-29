
const products = require("../../models/product");
const removeProductController = async (req, res) => {
  try {
    const { productId, quantity,reason } = req.body;
    console.log(req.body)
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

    const newQuantity = Math.max(currentQuantity - deleteQuantity, 0);

    await products.updateProductQuantity(newQuantity, productId);

    await products.updateHistory(productId, product.name, deleteQuantity, reason);

    
    const message =
      newQuantity === 0
        ? "המוצר עודכן בהצלחה לכמות 0."
        : "הכמות עודכנה בהצלחה.";

    return res.status(200).json({ message, quantity: newQuantity });
  } catch (err) {
    console.error("Error deleting/updating product:", err.message);
    return res.status(500).json({ message: "שגיאה כללית במחיקת/עדכון מוצר." });
  }
};


module.exports.removeProductController = removeProductController;
