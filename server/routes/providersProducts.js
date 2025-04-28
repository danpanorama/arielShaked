var express = require('express');
var router = express.Router();
const jwtMiddleware = require('../middleware/jwt');
const { assignProductsController } = require('../controller/providersProducts/assignProductsController');
const { getAllProvidersProducts } = require('../controller/providersProducts/getAllProvidersProducts');

/* GET home page. */
router.get('/',jwtMiddleware.jwtAuth,getAllProvidersProducts, function(req, res, next) {
 
}); 


router.post('/assignProduct',jwtMiddleware.jwtAuth,assignProductsController, function(req, res, next) {

});





module.exports = router;
