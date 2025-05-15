var express = require('express');
var router = express.Router();
const jwtMiddleware = require('../middleware/jwt');
const { getAllProvidersController } = require('../controller/providers/getProviders');
const { addProviderController } = require('../controller/providers/addProvider');
const { removeProviderController } = require('../controller/providers/removeProvider');
const getProviderItemController = require('../controller/providers/getProviderItemController');
const { providerOrder } = require('../controller/providersProducts/providerOrder');
const { getAllProvidersOrderController } = require('../controller/providersProducts/getAllProvidersOrderController');
const { providersOrdersController } = require('../controller/orders/providerOrders/providersOrdersController');
const { getOrderByIdController } = require('../controller/orders/providerOrders/getOrderByIdController');
const { getUnapprovedOrders } = require('../controller/orders/providerOrders/getUnapprovedOrders');
const { approve_order } = require('../controller/orders/providerOrders/approve_order');
const { updatePaymentController } = require('../controller/orders/providerOrders/updatePaymentController');

/* GET home page. */
router.get('/',jwtMiddleware.jwtAuth,getAllProvidersController, function(req, res, next) {
 
}); 
router.post('/items',jwtMiddleware.jwtAuth,getProviderItemController, function(req, res, next) {
 
}); 
router.post('/providersOrders',jwtMiddleware.jwtAuth,providersOrdersController, function(req, res, next) {
 
 
}); 

router.get('/getAllOrders',jwtMiddleware.jwtAuth,getAllProvidersOrderController, function(req, res, next) {
 
 
}); 

router.get('/orderNumber/:orderId',jwtMiddleware.jwtAuth,getOrderByIdController, function(req, res, next) {
 
 
}); 
router.post('/addProvider',jwtMiddleware.jwtAuth,addProviderController, function(req, res, next) {

});

router.get('/unapprovedOrders',jwtMiddleware.jwtAuth,getUnapprovedOrders, function(req, res, next) {
 
 
}); 
router.post('/confirm',jwtMiddleware.jwtAuth,approve_order, function(req, res, next) {
 

});

router.post('/update-payment',jwtMiddleware.jwtAuth,updatePaymentController, function(req, res, next) {
  console.log(req.body)
 

});



router.post('/editProvider', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/removeProvider',jwtMiddleware.jwtAuth,removeProviderController, function(req, res, next) {
  res.render('index', { title: 'Express' });
});




module.exports = router;
