var express = require('express');
var router = express.Router();
var profileController = require('../controllers/profileController.js');

/* GET all profile listing. */
router.get('/:originalName', profileController.getProfile);

/*Post all profile*/
router.post('/:userprofile', profileController.postProfile);

module.exports = router;