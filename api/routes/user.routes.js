var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');
var authMiddlware = require('../middleware/auth.middleware');

// auth route middleware
router.use(authMiddlware.checkToken);
router.post('/update', userController.update);
router.delete('/delete', userController.deleteAccount);

module.exports = router;
