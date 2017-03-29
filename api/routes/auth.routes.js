var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');
var authMiddleware = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authMiddleware.checkToken, authController.logout);

module.exports = router;
