const usersModel = require("../../models/users");

const activeUserController = async (req, res) => {
  try {
    const { userId, permission } = req.body;
    console.log(userId, permission)

    if (!userId ) {
      return res.status(400).json({ message: "חסר מזהה משתמש או סוג הרשאה" });
    }

    // עדכון ההרשאה במסד
    await usersModel.activate(permission,userId);
console.log( req.body)


    return res.status(200).json({ users: "success" });
  } catch (err) {
    console.error("Error updating user permission:", err.message);
    return res.status(500).json({ message: "שגיאה בעדכון הרשאות המשתמש" });
  }
};

module.exports = { activeUserController };
