const products = require("../../models/product");

const changeStatusController = async (req, res) => {
  try {   
    const product = await products.changeStatus(req.body.status,req.body.productId);
    console.log(req.body)
    return res.status(200).json({message:'success'});
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ message: "שגיאה בעת שינוי סטטוס" });
  }
};

module.exports.changeStatusController = changeStatusController;
