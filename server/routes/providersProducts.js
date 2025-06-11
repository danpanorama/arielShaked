var express = require('express');
var router = express.Router();
const jwtMiddleware = require('../middleware/jwt');
const { assignProductsController } = require('../controller/providersProducts/assignProductsController');
const { getAllProvidersProducts } = require('../controller/providersProducts/getAllProvidersProducts');
const { updatePriceController } = require('../controller/providersProducts/updatePriceController');
const { updateMinQtyController } = require('../controller/providersProducts/updateMinQtyController');

/* GET home page. */
router.get('/',jwtMiddleware.jwtAuth,getAllProvidersProducts, function(req, res, next) {
 
}); 


router.post('/assignProduct',jwtMiddleware.jwtAuth,assignProductsController, function(req, res, next) {

});

router.post('/update-min-qty',jwtMiddleware.jwtAuth,updateMinQtyController, function(req, res, next) {
    

});

router.post('/update-payment',jwtMiddleware.jwtAuth,updatePriceController, function(req, res, next) {
console.log('here',req.body)
});
 


module.exports = router;
