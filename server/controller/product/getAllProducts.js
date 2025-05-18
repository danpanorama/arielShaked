const products = require("../../models/product");

const getAllProductsController = async (req, res) => {
  try {
   
    const allProducts = await products.getAllProducts();
    return res.status(200).json(allProducts);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ message: "שגיאה בעת שליפת רשימת המוצרים." });
  }
};

module.exports.getAllProductsController = getAllProductsController;
