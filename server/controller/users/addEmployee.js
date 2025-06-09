const authbcrypt = require("../../auth/bycrypt");
const users = require("../../models/users");
const jwt = require("../../auth/jwt");
 
const addEmployee = async (req, res, next) => {
try {
        const { name, password, repeatPassword, email, phone, permissions,is_active } = req.body;

        console.log(req.body)
        if (!name  || !password || !repeatPassword || !email || !phone || permissions === undefined) {
          return res.status(400).json({
            message: "נא למלא את כל השדות",
          });
        }  
        if (password !== repeatPassword) {
            return res.status(400).json({
                message: "סיסמה ואימות סיסמה אינם זהים!"
            });
        }
        // בדוק אם האימייל כבר קיים
        let userExists = await users.checkIfEmailExists(email);
        if (userExists[0].length > 0) {
            return res.json({
                error: {message:"האימייל כבר נמצא בשימוש",header:"המשתמש קיים"}
            });
        } 
        // הצפנת הסיסמה

        // יצירת טוקן JWT
        let token = await jwt.makeToken({
            hash: password
        });
        // הוספת המשתמש החדש למסד הנתונים
        let insertNewUser = await users.insertNewUser(name, email, password, phone,permissions,is_active||1);
        if (insertNewUser) {
            // חפש את המשתמש החדש לאחר ההכנסה
            let user = await users.checkIfEmailExists(email);
            // הכנס את הטוקן לקובץ קוקיז
            res.cookie("auth_token", token, {
                httpOnly: true, // לא מאפשר גישה לקוקיז מהצד של הלקוח
                secure: process.env.NODE_ENV === "production", // אם אתה בסביבת פרודקשן, השתמש ב-HTTPS
                maxAge: 3600000, // הזמן שבו הקוקיז יהיו בתוקף (למשל 1 שעה)
            });
            res.json({user:user[0][0]})
        }

    } catch (err) {
        console.error("Error during signup:", err.message);
        let errorMessage = "שגיאה בעת יצירת משתמש חדש: ייתכן ושם המשתמש או האימייל כבר קיימים במערכת.";
        if (err.code === 11000) {
            errorMessage = "שם המשתמש או האימייל כבר קיימים במערכת.";
        } else if (err.message.includes("username")) {
            errorMessage = "שם המשתמש כבר קיים במערכת.";
        } else if (err.message.includes("email")) {
            errorMessage = "כתובת האימייל כבר קיימת במערכת.";
        }
        return res.status(400).json({
            message: errorMessage
        });
    }
};

module.exports.addEmployee = addEmployee;