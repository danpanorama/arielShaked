const jwt = require("../auth/jwt");


const jwtAuth = async (req, res, next) => {
    try {
        const token = req.body.token || req.headers['authorization'];
        if (token) {
            let pass = await jwt.checkingToken(token);
            if (pass) {
                req.token = token;
                next();
            } else {
                return res.status(401).json({ message: "Invalid token" });
            }
        } else {
            return res.status(400).json({ message: "No token provided" });
        }
    } catch (e) {
        return res.status(500).json({ message: "Error processing token", error: e.message });
    }
};

module.exports.jwtAuth = jwtAuth;


