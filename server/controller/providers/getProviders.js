const providers = require("../../models/providers");

const getAllProvidersController = async (req, res) => {
  try {
    const providersArray = await providers.getAllProviders();
    res.status(200).json(providersArray[0]);
  } catch (err) {
    console.error("Error fetching providers:", err.message);
    res.status(500).json({
      message: "שגיאה בעת שליפת הספקים.",
      header: "שגיאת שרת"
    });
  }
};

module.exports.getAllProvidersController = getAllProvidersController;
