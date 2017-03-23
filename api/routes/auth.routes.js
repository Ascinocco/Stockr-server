var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');

router.post('/login');
router.post('/register')

module.exports = router;
