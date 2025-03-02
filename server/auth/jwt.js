const jwt = require("jsonwebtoken");
const localStorage = require("localStorage");

const makeToken = (data) => {
  let on = localStorage.getItem("isRemember");
  let tims;
  console.log("jwt");
  if (on) {
    tims = "30d";
  } else {
    tims = "5s";
  }
  console.log(on);
  return new Promise((ok, not) => {
    jwt.sign(data, "yy-pp--sd", { expiresIn: tims }, (err, token) => {
      if (err) not(err);
      else ok(token);
    });
  });
};

const checkingToken = (token) => {
  return new Promise((ok, notok) => {
    jwt.verify(token, "yy-pp--sd", (err, decoded) => {
      if (err) notok(err);
      else ok(decoded);
    });
  });
};

module.exports.makeToken = makeToken;
module.exports.checkingToken = checkingToken;
