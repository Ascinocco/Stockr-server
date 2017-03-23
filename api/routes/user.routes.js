var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    msg: "user routes"
  })
});

module.exports = router;
