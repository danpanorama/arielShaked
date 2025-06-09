var express = require('express');
var router = express.Router();
var jwt = require('../auth/jwt');
const {
  getAllUsersController
} = require('../controller/users/getAllUsers');
const {
  switchPermissionsController
} = require('../controller/users/switchPermissionsController');
const {
  removeUserController
} = require('../controller/users/removeUserController');
const {
  jwtAuth
} = require('../middleware/jwt');
const {
  activeUserController
} = require('../controller/users/activeUserController');
const {
  addEmployee
} = require('../controller/users/addEmployee');
const { UpdateUser } = require('../controller/users/UpdateUser');

/* GET users listing. */
router.get('/', getAllUsersController, function (req, res, next) {

});
router.post('/adduser', addEmployee, function (req, res, next) {

});
// router.post('/permissions',switchPermissionsController, function(req, res, next) {

// });
router.post('/active', jwtAuth, activeUserController, function (req, res, next) {

});

router.post('/update', jwtAuth, UpdateUser, function (req, res, next) {

});
router.post('/removeUser', removeUserController, function (req, res, next) {

});
router.get("/checkAuth", async (req, res, next) => {
  try {
    const token = req.cookies.auth_token; // Read token from HTTP-only cookie

    if (!token) {


      return res.status(401).json({
        success: false,
        message: "אין אישור: לא נמצא טוקן זיהוי משתמש"
      });
    }

    const decoded = await jwt.checkingToken(token, process.env.JWT_SECRET);


    return res.status(200).json({
      success: true,
      user: decoded
    });

  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(403).json({
      success: false,
      message: "טוקן זיהוי משתמש פג תוקף או לא תקין"
    });
  }
});

module.exports = router;