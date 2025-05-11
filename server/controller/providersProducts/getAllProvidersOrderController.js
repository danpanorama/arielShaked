const providerOrdersModel = require("../../models/providerOrder");

const getAllProvidersOrderController = async (req, res) => {
  try {
    const [rows] = await providerOrdersModel.getAllProviderOrders();
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching provider orders:", err.message);
    res.status(500).json({ message: "שגיאה בשליפת נתוני הזמנות ספקים." });
  }
};

module.exports.getAllProvidersOrderController = getAllProvidersOrderController;
