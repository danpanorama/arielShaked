const hapijoi = require("../../auth/joiLogin");
const authbcrypt = require("../../auth/bcrypt");
const users = require("../../models/sql/users");
const jwt = require("../../auth/jwt");
const localStorage = require("localStorage");

// this is logg in function
const loginController = async (req, res, next) => {
  try {
    localStorage.setItem("isRemember", req.body.remember);

    if (!req.body.name || !req.body.password) {
      return res.status(400).json({
        err: { message: "Name and password are required" }
      });
    }

    let data = req.body;
    let finduser = await users.selectUserByName(data.name);

    if (finduser[0].length > 0) {
      let user = finduser[0][0]; // Assuming the first result is the user
      let checkpassword = await authbcrypt.checkPassword(req.body.password, user.password);

      if (checkpassword) {
        let checkToken = await jwt.makeToken({ hash: user.password });

        if (checkToken) {
          return res.json({
            user: user,
            remember: req.body.remember,
            token: checkToken,
            number: user.id
          });
        } else {
          return res.status(500).json({
            err: { message: "Error generating token" }
          });
        }
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
    console.log("Error during login: ", e.message);
    return res.status(500).json({
      err: { message: "Server error: " + e.message }
    });
  }
};

module.exports.loginController = loginController;
