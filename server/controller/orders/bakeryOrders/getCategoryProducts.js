const mysql = require("../../../models/product");

const getCategoryProducts = async (req, res) => {
  try {
console.log(req.query.category)

    const orderRows = await mysql.getAllProductsByCategory(req.query.category);
  
    
console.log(orderRows[0])  
    res.json(orderRows[0]);
  } catch (err) {
    console.error("שגיאה בשליפת ההזמנות:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

module.exports.getCategoryProducts = getCategoryProducts;
