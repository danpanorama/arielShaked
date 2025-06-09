const jwt = require("../auth/jwt");

const jwtAuth = async (req, res, next) => {
  try {
    
    const token =
      req.cookies?.auth_token || req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({header:"צריך להתחבר מחדש", message: "לא התקבל טוקן" });
    }  

    const isValid = await jwt.checkingToken(token);
    if (!isValid) {
      return res.status(401).json({noToken:1, message: "טוקן לא תקין" });
    }

    req.token = token;
    next();
  } catch (e) {
    return res.status(500).json({data:{header:'לא נמצא טוקן ולידי לכניסה ',message:'לגשת להתחבר מחדש'} });
  }
};

module.exports.jwtAuth = jwtAuth;


