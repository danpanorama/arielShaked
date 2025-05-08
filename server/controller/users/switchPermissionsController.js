const usersModel = require("../../models/users");

const switchPermissionsController = async (req, res) => {
  try {
    const { id, permission } = req.body;

    if (!id || !permission) {
      return res.status(400).json({ message: "חסר מזהה משתמש או סוג הרשאה" });
    }

    // עדכון ההרשאה במסד
    await usersModel.updateUserPermission(permission,id);



    return res.status(200).json({ users: "success" });
  } catch (err) {
    console.error("Error updating user permission:", err.message);
    return res.status(500).json({ message: "שגיאה בעדכון הרשאות המשתמש" });
  }
};

module.exports = { switchPermissionsController };
