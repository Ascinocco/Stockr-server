var express = require('express');
var router = express.Router();
var stockRoutes = require('../controllers/stock.controller');

/* GET home page. */
router.get('/', stockRoutes.index);

module.exports = router;
