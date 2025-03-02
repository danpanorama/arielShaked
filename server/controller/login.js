const hapijoi = require("../../auth/joiLogin");
const authbcrypt = require("../../auth/bcrypt");
const users = require("../../models/sql/users");
const jwt = require("../../auth/jwt");
const localStorage = require("localStorage");

const loginController = async (req, res, next) => {
  try {
    // בדיקה אם המשתמש הכניס שם וסיסמה
    if (!req.body.name || !req.body.password) {
      return res.status(400).json({
        err: { message: "Name and password are required" }
      });
    }

    // חיפוש המשתמש במסד הנתונים
    let finduser = await users.selectUserByName(req.body.name);

    if (finduser[0].length > 0) {
      let user = finduser[0][0]; // משתמש שנמצא
      let checkpassword = await authbcrypt.checkPassword(req.body.password, user.password);

      if (checkpassword) {
        // יצירת טוקן JWT
        const token = await jwt.sign({ id: user.id }, "YOUR_SECRET_KEY", { expiresIn: '1h' });

        // שמירת הטוקן בקוקיז
        res.cookie('authToken', token, {
          httpOnly: true,  // הגדרת httpOnly כדי להבטיח שג'אווה סקריפט לא יוכל לגשת לטוקן
          secure: true,    // הגדרת secure כדי שהטוקן ישלח רק בבקשות דרך HTTPS
          sameSite: 'Strict', // מונע שליחת הטוקן לאתרים חיצוניים
          maxAge: 60 * 60 * 1000 // תוקף ה-Cookie ל-1 שעה
        });

        // שליחת תגובה ללקוח
        return res.status(200).json({
          message: "Logged in successfully",
          userInfo: user
        });
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
