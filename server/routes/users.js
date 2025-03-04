var express = require('express');
var router = express.Router();
var jwt = require('../auth/jwt')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/checkAuth", async (req, res) => {
  try {
      const token = req.cookies.shaked; // Read token from HTTP-only cookie

      if (!token) {
          return res.status(401).json({ success: false, message: "אין אישור: לא נמצא טוקן זיהוי משתמש" });
      }

      const decoded = await jwt.checkingToken(token, process.env.JWT_SECRET);
      
      return res.status(200).json({ success: true, user: decoded });

  } catch (error) {
      console.error("Error verifying token:", error.message);
      return res.status(403).json({ success: false, message: "טוקן זיהוי משתמש פג תוקף או לא תקין" });
  }
});

module.exports = router;
