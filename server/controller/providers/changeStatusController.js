const providers = require("../../models/providers");

const changeStatusController = async (req, res, next) => {
  try {
    const {providerId,status} = req.body

    const mysql = providers.changeStatus(status,providerId);

    res.json({message:'success'})



  } catch (err) {
    console.error("Error during provider creation:", err.message);
    let errorMessage = "שגיאה בעת יצירת ספק חדש.";

    if (err.code === 11000 || err.message.includes("email")) {
      errorMessage = "כתובת האימייל כבר קיימת במערכת.";
    }

    return res.status(400).json({ message: errorMessage,Header:'ggg' });
  }
};

module.exports.changeStatusController = changeStatusController;
