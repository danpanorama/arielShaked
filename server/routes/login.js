var express = require('express');
const login = require('../controller/login');
const signup = require('../controller/signUp');

var router = express.Router();

/* GET home page */
router.post('/', login.loginController, function(req, res, next) {
  res.json({user:req.user,message:'user log in '});
});
router.post('/signup',signup.signUpController, function(req, res, next) {
 
  res.json({user:req.user,message:'user signup '});
});

router.get('/logout', function(req, res, next) {
  res.json({user:userinfo,message:'user log in '});
});

module.exports = router;
