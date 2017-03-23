var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');

/* GET home page. */
router.get('/', authController.index);

module.exports = router;
