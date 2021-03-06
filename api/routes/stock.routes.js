var express = require('express');
var router = express.Router();
var stockController = require('../controllers/stock.controller');
var authMiddlware = require('../middleware/auth.middleware');

// auth route middleware
router.use(authMiddlware.checkToken);

router.get('/feed', stockController.feed); // get all stocks that user is subscribed to
router.post('/search', stockController.search); // search for stocks
router.post('/add', stockController.add); // add stock to watched stocks
router.post('/popular', stockController.popular); // list of popular stocks
router.post('/remove', stockController.remove); // remove a followed stock
router.post('/details', stockController.details);

module.exports = router;