const bcrypt = require("bcrypt");

const hashPassport = (password) => {
  return new Promise((ok, not) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) not(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) not(err);
        else ok(hash);
      });
    });
  });
};

const checkPassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports.hashPassport = hashPassport;
module.exports.checkPassword = checkPassword;