const users = require("../../models/users");

const getAllUsersController = async (req, res) => {
    try {
        const result = await users.getAllUsers(); // הנחה: הפונקציה הזו קיימת בקובץ models/users.js
        const userList = result[0]; // אם אתה משתמש ב-MySQL עם mysql2 אז התוצאה חוזרת במבנה כזה
        console.log(userList)
        return res.status(200).json({
            users: userList
        });
    } catch (e) {
        console.error("Error fetching users:", e);
        return res.status(500).json({
            error: {
                message: "שגיאה בטעינת משתמשים: " + e.message
            }
        });
    }
};

module.exports.getAllUsersController = getAllUsersController;