const users = require("../models/users");
const jwt = require("../auth/jwt");

const signUpController = async (req, res, next) => {
  try {
    const { name, password, repeatPassword, email, phone } = req.body;
    const permissions = 4;
    const is_active = 1;

    if (!name || !password || !repeatPassword || !email || !phone) {
      return res.status(400).json({
        message: "נא למלא את כל השדות",
      });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({
        message: "סיסמה ואימות סיסמה אינם זהים!"
      });
    }

    let userExists = await users.checkIfEmailExists(email);
    if (userExists[0].length > 0) {
      return res.json({
        error: { message: "האימייל כבר נמצא בשימוש", header: "המשתמש קיים" }
      });
    }

    let token = await jwt.makeToken({ email }, process.env.JWT_TOKEN, { expiresIn: '1h' });

    let insertNewUser = await users.insertNewUser(name, email, password, phone, permissions, is_active);
    if (insertNewUser) {
      let user = await users.checkIfEmailExists(email);

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });

      req.user = user[0][0];
      next();
    }

  } catch (err) {
    console.error("Error during signup:", err.message);
    return res.status(400).json({
      message: "שגיאה בעת יצירת משתמש חדש"
    });
  }
};

module.exports.signUpController = signUpController;
