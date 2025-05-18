// const products = require("../../models/product");
// const providers = require("../../models/providers");
// const providersProduct = require("../../models/ProductProvider");
// const assignProductsController = async (req, res) => {
//   try {
// console.log(req.body)
//     const {
//       item_number,
//       provider_name,
//       provider_id,
//       price,
//       estimated_delivery_time,
//       min_order_quantity,
//       is_active
//     } = req.body;

//     if (!item_number || !provider_id) {
//       return res.status(400).json({ message: "פרטי מוצר או ספק חסרים." });
//     }

//     const [productRows] = await products.getProductsById(item_number);
//     if (!productRows.length) {
//       return res.status(404).json({ message: "מוצר לא נמצא." });
//     }

//     const [providerRows] = await providers.getProvidersById(provider_id);
//     if (!providerRows.length) {
//       return res.status(404).json({ message: "ספק לא נמצא." });
//     }

//     // 🔒 בדיקה אם כבר קיים שיוך כזה
//     const [existingRows] = await providersProduct.getProviderProductByIds(item_number, provider_id);
//     if (existingRows.length > 0) {
//       return res.status(409).json({
//         message: "המוצר כבר משויך לספק זה.",
//       });
//     }

//     const product = productRows[0];
//     const name = product.name;

//     const productProviderId = await providersProduct.insertNewProviderProduct(
//       item_number,
//       name,
//       provider_name,
//       provider_id,
//       price || 0,
//       estimated_delivery_time || null,
//       min_order_quantity || 1,
//       true
//     );

//     console.log(productProviderId[0].insertId)
//     let itemId = productProviderId[0].insertId

//     return res.status(200).json({
//       message: "המוצר שויך בהצלחה לספק.",
//       item_number,
//       provider_id,
//       itemId,
//       name
//     });

//   } catch (err) {
//     console.error("Error assigning product to provider:", err.message);
//     return res.status(500).json({ message: "שגיאה בשיוך המוצר לספק." });
//   }
// };

// module.exports.assignProductsController = assignProductsController;



const products = require("../../models/product");
const providers = require("../../models/providers");
const providersProduct = require("../../models/ProductProvider");

const assignProductsController = async (req, res) => {
  try {
    console.log(req.body);
    const {
      item_number,

      provider_id,
      price,
      min_order_quantity,
      is_active
    } = req.body;


    const getProvider = await providers.getProvidersById(provider_id);
    const provider_name = getProvider[0][0].name

    console.log(getProvider)


    if (!item_number || !provider_id || price < 1) {
      return res.status(400).json({
        message: "פרטי מוצר או ספק חסרים."
      });
    }

    const [productRows] = await products.getProductsById(item_number);
    if (!productRows.length) {
      return res.status(404).json({
        message: "מוצר לא נמצא."
      });
    }

    const [providerRows] = await providers.getProvidersById(provider_id);
    if (!providerRows.length) {
      return res.status(404).json({
        message: "ספק לא נמצא."
      });
    }

    // 🔒 בדיקה אם המוצר כבר משויך לספק כלשהו
    const [existingAssignments] = await providersProduct.getProvidersByProductId(item_number);
    if (existingAssignments.length > 0) {
      return res.status(409).json({
        message: "המוצר כבר משויך לספק אחר. יש להסיר את השיוך הקודם לפני שיוך חדש.",
      });
    }

    const product = productRows[0];
    const name = product.name;

    const productProviderId = await providersProduct.insertNewProviderProduct(
      item_number,
      name,
      provider_name,
      provider_id,
      price || 0,

      min_order_quantity || 1,
      is_active !== undefined ? is_active : true
    );

    let id = productProviderId[0].insertId;
    let obj = {
    item_number,
    id,
      name,
      provider_name,
      provider_id,
      price,
      min_order_quantity ,
       is_active
    }

    return res.status(200).json({
      message: "המוצר שויך בהצלחה לספק.",
   obj
    });

  } catch (err) {
    console.error("Error assigning product to provider:", err.message);
    return res.status(500).json({
      message: "שגיאה בשיוך המוצר לספק."
    });
  }
};

module.exports.assignProductsController = assignProductsController;