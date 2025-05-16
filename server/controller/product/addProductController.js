const products = require("../../models/product");

const addProductController = async (req, res, next) => {
  try {
    ("Inside Add Product Route");
    ("req.body: ", req.body);

    const { name, category, quantity, unit, min_required,is_active } = req.body;

    if (!name || !category || quantity === undefined || !unit || !min_required  || is_active === undefined ) {
      return res.status(400).json({
        error: "יש למלא את כל השדות: שם מוצר, קטגוריה, כמות, יחידה, מינימום נדרש וסטטוס פעיל.",
      });
    }
 
    // בדיקה אם מוצר עם אותו שם כבר קיים
    const existingProduct = await products.checkIfProductExistsByName(name);
    if (existingProduct[0].length > 0) {
      return res.status(400).json({
        error: "מוצר עם שם זה כבר קיים במערכת." }
      );
    }


const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // הכנסת מוצר חדש למסד הנתונים
    const insertResult = await products.insertNewProduct(name, category, 0, unit, min_required,time ,1);
    if (insertResult) {
      const newProduct = await products.checkIfProductExistsByName(name);
      res.json({product:newProduct[0]})
    }

  } catch (err) {
    console.error("Error during product creation:", err.message);
    return res.status(400).json({
      message: "שגיאה בעת יצירת מוצר חדש."
    });
  }
};

module.exports.addProductController = addProductController;
