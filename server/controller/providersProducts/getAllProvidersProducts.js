const providerProducts = require("../../models/ProductProvider");

const getAllProvidersProducts = async (req, res) => {
  try {
   
    const rows = await providerProducts.getAllProviderProducts();
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching provider products:", err.message);
    return res.status(500).json({ message: "שגיאה בשליפת נתוני שיוכי מוצרים." });
  }
};

module.exports.getAllProvidersProducts = getAllProvidersProducts;
