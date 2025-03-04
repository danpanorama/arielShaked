const jwt = require("jsonwebtoken");

const makeToken = (data) => {
  return new Promise((ok, not) => {
    jwt.sign(data, "yy-pp--sd", { expiresIn: '7d' }, (err, token) => {
      if (err) not(err);
      else ok(token);
    });
  });
};


const checkingToken = (token) => {
  return new Promise((ok, noToken) => {
    jwt.verify(token, "yy-pp--sd", (err, decoded) => {
      if (err) noToken(err);
      else ok(decoded);
    });
  });
};


module.exports.makeToken = makeToken;
module.exports.checkingToken = checkingToken;
