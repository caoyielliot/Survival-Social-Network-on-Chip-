var express = require('express');
var router = express.Router();
var statusController = require('../controllers/statusController.js');

/* GET users listing. */
router.get('/:user_name', statusController.getStatus);
router.post('/', statusController.updateStatus);
router.post('/get_location', statusController.getLocation);
router.post('/save_location', statusController.updateLocation);

module.exports = router;