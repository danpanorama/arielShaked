const authbcrypt = require("../auth/bycrypt");
const users = require("../models/users");
const jwt = require("../auth/jwt");

const loginController = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        err: { message: "Name and password are required" }
      });
    }

    let user = await users.checkIfEmailExists(req.body.email);

    if (user[0].length > 0) {
      let user = user[0][0];
      let checkpassword = await authbcrypt.checkPassword(req.body.password, user.password);


      if (checkpassword) {
        const token = await jwt.makeToken({ id: user.id }, process.env.JWT_TOKEN, { expiresIn: '1h' });
        res.cookie('authToken', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          maxAge: 60 * 60 * 1000
        });

        // הגדרת הנתונים שנעביר הלאה
        req.user = user;

        // קריאה ל-next כדי להעביר לראוטר
        return next();
      } else {
        return res.status(401).json({
          err: { message: "Password or username is incorrect" }
        });
      }
    } else {
      return res.status(404).json({
        err: { message: "No such user" }
      });
    }
  } catch (e) {
    return res.status(500).json({
      err: { message: "Server error: " + e.message }
    });
  }
};

module.exports.loginController = loginController;
