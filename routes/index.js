"use strict";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout');
});

router.get('/partials/:name', function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name, {currentUser: req.session.currentUser});
});

router.get('/logout', function(req, res) {
	req.session.regenerate(function() {
		res.sendStatus(302);
	});
});

module.exports = router;
