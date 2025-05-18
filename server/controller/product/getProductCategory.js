const products = require("../../models/product");

const getProductCategories = async (req, res) => {
  try {
    const [categories] = await products.getAllCategories();
    return res.status(200).json(categories); // זה יחזיר מערך כמו: [{ category: "קפואים" }, { category: "יבשים" }]
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    return res.status(500).json({ message: "שגיאה בעת שליפת הקטגוריות." });
  }
};

module.exports.getProductCategories = getProductCategories;
