const productsModel = require("../../models/product");

const AddStockController = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "חסר מזהה מוצר או כמות" });
    }

    // שלוף את המוצר מהדאטהבייס
    const [rows] = await productsModel.getProductsById(productId);

    if (rows.length === 0) {
      return res.status(404).json({ error: "המוצר לא נמצא" });
    }

    const existingProduct = rows[0];
   const newQuantity = Number(existingProduct.quantity) + Number(quantity);


    console.log(req.body)

    // עדכן את הכמות
    await productsModel.updateProductQuantity(newQuantity, productId);
console.log(newQuantity, productId)
    // שלוף שוב את המוצר לאחר עדכון
    const [updatedRows] = await productsModel.getProductsById(productId);

    return res.status(200).json({
      message: "המלאי עודכן בהצלחה",
      product: updatedRows,
    });
  } catch (err) {
    console.error("שגיאה בהחזרת מוצר למלאי:", err);
    res.status(500).json({ error: "שגיאה בשרת בעת עדכון מלאי" });
  }
};

module.exports.AddStockController = AddStockController;
