var express = require('express');
const { addProductController } = require('../controller/product/addProductController');
const { jwtAuth } = require('../middleware/jwt');
const { getAllProductsController } = require('../controller/product/getAllProducts');
const { deleteProductController } = require('../controller/product/removeProduct');
var router = express.Router();

/* GET home page. */
router.get('/',jwtAuth,getAllProductsController, function(req, res, next) {

});


router.post('/addProduct',jwtAuth,addProductController, function(req, res, next) {

});


router.post('/editProduct', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/removeProduct',jwtAuth,deleteProductController, function(req, res, next) {

});
module.exports = router;
