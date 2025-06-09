var express = require('express');
var router = express.Router();
const jwtMiddleware = require('../middleware/jwt');
const { getAllBakeryOrdersController } = require('../controller/orders/bakeryOrders/getAllBakeryOrdersController');
const { NewOrderController } = require('../controller/orders/bakeryOrders/NewOrderController');
const { SetTimeController } = require('../controller/orders/bakeryOrders/SetTimeController');
const { FinishOrder } = require('../controller/orders/bakeryOrders/FinishOrder');

/* GET home page. */
router.get('/',jwtMiddleware.jwtAuth,getAllBakeryOrdersController, function(req, res, next) {
 
}); 




router.post('/finish',jwtMiddleware.jwtAuth,FinishOrder, function(req, res, next) {
    console.log(req.body)
 
}); 

router.post('/newOrder',jwtMiddleware.jwtAuth,NewOrderController, function(req, res, next) {
    console.log(req.body)
 
}); 

router.post('/estimated-time',jwtMiddleware.jwtAuth,SetTimeController, function(req, res, next) {

 
}); 




module.exports = router;
