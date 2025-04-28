const authbcrypt = require("../auth/bycrypt");
const users = require("../models/users");
const jwt = require("../auth/jwt");
 
const signUpController = async (req, res, next) => {

    try {
        ("date: " + " .Inside Signup Post route");
        ('req.body: ', req.body);
        const { firstName, lastName, password, repeatPassword, email, phone, permissions } = req.body;
        if (!firstName || !lastName || !password || !repeatPassword || !email || !phone || permissions === undefined) {
          return res.status(400).json({
            message: "All fields are required: firstName, lastName, password, repeatPassword, email, phone, and permissions.",
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
        let hash = await authbcrypt.hashPassport(password);

        // יצירת טוקן JWT
        let token = await jwt.makeToken({
            hash: hash
        });

        // הוספת המשתמש החדש למסד הנתונים
        let insertNewUser = await users.insertNewUser(firstName, email, hash, phone,permissions,1);
        if (insertNewUser) {
            // חפש את המשתמש החדש לאחר ההכנסה
            let user = await users.checkIfEmailExists(email);

            // הכנס את הטוקן לקובץ קוקיז
            res.cookie("auth_token", token, {
                httpOnly: true, // לא מאפשר גישה לקוקיז מהצד של הלקוח
                secure: process.env.NODE_ENV === "production", // אם אתה בסביבת פרודקשן, השתמש ב-HTTPS
                maxAge: 3600000, // הזמן שבו הקוקיז יהיו בתוקף (למשל 1 שעה)
            });

             req.user =  user[0][0],
            
            next()
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

module.exports.signUpController = signUpController;