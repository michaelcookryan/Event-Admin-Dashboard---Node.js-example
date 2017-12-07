var express = require('express');
var router = express.Router();

//this is the admin homepage
router.get('/', function(req, res, next) {
    res.render('register');
});


module.exports = router;