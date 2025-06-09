const ProductProvider = require("../../models/ProductProvider");

const updatePriceController = async (req, res) => {
  try {
   
    const { productId, newPrice } = req.body;
    console.log(req.body)

    if (!productId || !newPrice ) {
      return res.status(400).json({ message: "שגיאה מחיר או מוצר חסרים " });
    }

    const result = await ProductProvider.updatePrice(newPrice,productId);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "המוצר לא נמצא." });
    }

    return res.status(200).json({ message: "המוצר עודכן בהצלחה." });
  } catch (err) {
    console.error("Error updating product:", err.message);
    return res.status(500).json({ message: "שגיאה בעת עדכון המוצר." });
  }
};

module.exports.updatePriceController = updatePriceController;
