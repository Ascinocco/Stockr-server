var express = require('express');
var router = express.Router();
var stockRoutes = require('../controllers/stock.controller');
var authMiddlware = require('../middleware/auth.middleware');

// auth route middleware
router.use(authMiddlware.checkToken);

/* GET home page. */
router.get('/', stockRoutes.index);

module.exports = router;
