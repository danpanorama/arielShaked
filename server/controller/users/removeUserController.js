const usersModel = require("../../models/users");

const removeUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(req.body)

    if (!userId) {
      return res.status(400).json({ message: "לא סופק מזהה משתמש למחיקה" });
    }

    await usersModel.removeUser(userId);

  

    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.error("שגיאה במחיקת משתמש:", err.message);
    return res.status(500).json({ message: "שגיאה במחיקת המשתמש מהמערכת" });
  }
};

module.exports = { removeUserController };
