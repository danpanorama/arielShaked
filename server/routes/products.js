var express = require('express');
const { addProductController } = require('../controller/product/addProductController');
const { jwtAuth } = require('../middleware/jwt');
const { getAllProductsController } = require('../controller/product/getAllProducts');
const { removeProductController } = require('../controller/product/removeProductController');
const { deleteProductCompletelyController } = require('../controller/product/deleteProductController');
const { AddStockController } = require('../controller/product/AddStockController');
const { changeStatusController } = require('../controller/product/changeStatusController');
const { getProductCategory, getProductCategories } = require('../controller/product/getProductCategory');
const { getCategoryProducts } = require('../controller/orders/bakeryOrders/getCategoryProducts');

var router = express.Router();

/* GET home page. */
router.get('/',jwtAuth,getAllProductsController, function(req, res, next) {
 
});

router.get('/category',jwtAuth,getProductCategories, function(req, res, next) {
  
});


router.get('/category/item',jwtAuth,getCategoryProducts, function(req, res, next) {
  
});


router.post('/addProduct',jwtAuth,addProductController, function(req, res, next) {

});
router.post('/status',jwtAuth,changeStatusController, function(req, res, next) {

});

router.post('/addStock',jwtAuth,AddStockController, function(req, res, next) {

});


router.post('/delete',jwtAuth,deleteProductCompletelyController, function(req, res, next) {

});

router.post('/editProduct', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/removeProduct',jwtAuth,removeProductController, function(req, res, next) {

});
module.exports = router;
