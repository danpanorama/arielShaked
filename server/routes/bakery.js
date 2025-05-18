var express = require('express');
var router = express.Router();
const jwtMiddleware = require('../middleware/jwt');
const { getAllBakeryOrdersController } = require('../controller/orders/bakeryOrders/getAllBakeryOrdersController');

/* GET home page. */
router.get('/',jwtMiddleware.jwtAuth,getAllBakeryOrdersController, function(req, res, next) {
 
}); 







module.exports = router;
