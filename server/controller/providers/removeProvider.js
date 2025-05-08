

// // const providers = require("../../models/providers");
// // const providersProduct = require("../../models/ProductProvider");

// // const removeProviderController = async (req, res) => {
// //   try {
// //     const { id } = req.body;

// //     if (!id) {
// //       return res.status(400).json({
// //         message: "יש לספק מזהה ספק (id) למחיקה.",
// //       });
// //     }

// //     // בדיקה אם הספק קיים
// //     const [providerExists] = await providers.getProvidersById(id);
// //     if (!providerExists.length) {
// //       return res.status(404).json({
// //         error: { message: "ספק לא נמצא במערכת", header: "שגיאה" }
// //       });
// //     }

// //     // 🔄 עדכון כל המוצרים של הספק ל-provider_id = 0
// //     await providers.updateAllProductsProviderToZero(id);

// //     // 🗑️ מחיקת הספק מהמסד
// //     await providers.deleteProviderById(id);

// //     return res.status(200).json({
// //       message: "הספק נמחק בהצלחה וכל המוצרים שלו הועברו ל'ספק כללי'.",
// //       providerId: id
// //     });

// //   } catch (err) {
// //     console.error("Error during provider deletion:", err.message);
// //     return res.status(500).json({
// //       message: "שגיאה בעת מחיקת ספק."
// //     });
// //   }
// // };

// // module.exports.removeProviderController = removeProviderController;
// const providers = require("../../models/providers");
// const providersProduct = require("../../models/ProductProvider");

// const removeProviderController = async (req, res) => {
//   try {
//     const { id } = req.body;

//     if (!id) {
//       return res.status(400).json({
//         message: "יש לספק מזהה ספק (id) למחיקה.",
//       });
//     }

//     // בדיקה אם הספק קיים
//     const [providerExists] = await providers.getProvidersById(id);
//     if (!providerExists.length) {
//       return res.status(404).json({
//         error: { message: "ספק לא נמצא במערכת", header: "שגיאה" }
//       });
//     }

//     // 🔄 עדכון כל המוצרים של הספק ל-provider_id = 0
//     await providers.updateAllProductsProviderToZero(id);

//     // 🗑️ מחיקת הספק מהמסד
//     await providers.deleteProviderById(id);

//     return res.status(200).json({
//       message: "הספק נמחק בהצלחה וכל המוצרים שלו הועברו ל'ספק כללי'.",
//       providerId: id
//     });

//   } catch (err) {
//     console.error("Error during provider deletion:", err.message);
//     return res.status(500).json({
//       message: "שגיאה בעת מחיקת ספק."
//     });
//   }
// };

// module.exports.removeProviderController = removeProviderController;


const providers = require("../../models/providers");
const providersProduct = require("../../models/ProductProvider");

const removeProviderController = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "יש לספק מזהה ספק (id) למחיקה.",
      });
    }

    // בדיקה אם הספק קיים
    const [providerExists] = await providers.getProvidersById(id);
    if (!providerExists.length) {
      return res.status(404).json({
        error: { message: "ספק לא נמצא במערכת", header: "שגיאה" }
      });
    }

    // 🧹 מחיקת כל שיוכי המוצרים לספק מהטבלה המקשרת
    await providersProduct.deleteAllProductsFromProvider(id);

    // 🗑️ מחיקת הספק מהמסד
    await providers.deleteProviderById(id);

    return res.status(200).json({
      message: "הספק נמחק בהצלחה וכל השיוכים שלו הוסרו.",
      providerId: id
    });

  } catch (err) {
    console.error("Error during provider deletion:", err.message);
    return res.status(500).json({
      message: "שגיאה בעת מחיקת ספק."
    });
  }
};

module.exports.removeProviderController = removeProviderController;
