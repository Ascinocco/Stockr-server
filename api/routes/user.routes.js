var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');
var authMiddlware = require('../middleware/auth.middleware');

// auth route middleware
router.use(authMiddlware.checkToken);

/* GET users listing. */
router.get('/', userController.index);

module.exports = router;
