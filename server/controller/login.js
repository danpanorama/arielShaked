const users = require("../models/users");
const jwt = require("../auth/jwt");

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: { data: { message: "Email and password are required", header: 'error' } }
      });
    }

    let getUser = await users.checkIfEmailExists(email);
    if (getUser[0].length > 0) {
      let user = getUser[0][0];
      if (user.is_active == 0) {
        return res.status(400).json({
          error: { data: { message: "המשתמש הזה חסום", header: 'error' } }
        });
      }

      // השוואה רגילה, לא עם bcrypt
      if (password === user.password) {
        const token = await jwt.makeToken({ id: user.id }, process.env.JWT_TOKEN, { expiresIn: '1h' });
        res.cookie('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 3600000
        });
        req.user = user;
        return next();
      } else {
        return res.status(401).json({
          error: { message: "אימייל או סיסמה לא נכונים", header: 'שגיאה בעת כניסה' }
        });
      }
    } else {
      return res.status(404).json({
        error: { message: "User not found" }
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: { message: "Server error: " + e.message }
    });
  }
};

module.exports.loginController = loginController;
