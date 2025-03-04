var express = require('express');
const login = require('../controller/login');
var router = express.Router();

/* GET home page */
router.get('/', login.loginController, function(req, res, next) {
  res.json({user:user,message:'user log in '});
});
router.get('/signup', login.loginController, function(req, res, next) {
  res.json({user:user,message:'user signup '});
});

router.get('/logout', function(req, res, next) {
  res.json({user:userinfo,message:'user log in '});
});

module.exports = router;
