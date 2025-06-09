const usersModel = require("../../models/users");
const bcrypt = require("bcrypt");

const UpdateUser = async (req, res) => {
  try {  

    console.log(req.body)
    const {
      id,
      name,
      email,
      phone,
      password,
      repeatPassword,
      permissions,
      is_active,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "חסר מזהה משתמש" });
    }

    if (password && password !== repeatPassword) {
      return res.status(400).json({ message: "הסיסמאות לא תואמות" });
    }

 

    // קריאה לפונקציה במודל
    const [result] = await usersModel.updateUserDetails(
      id,
      name,
      password,
      email,
      phone,
      permissions,
     1
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא משתמש לעדכון" });
    }

    return res.status(200).json({ message: "המשתמש עודכן בהצלחה" });
  } catch (err) {
    console.error("שגיאה בעדכון המשתמש:", err.message);
    return res.status(500).json({ message: "שגיאה בעדכון המשתמש" });
  }
};

module.exports = { UpdateUser };
