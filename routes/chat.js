var express = require('express');
var router = express.Router();
var chatpublicallyController = require('../controllers/chatpublicallyController.js');
var chatprivatelyController=require('../controllers/chatPrivatelyController');

/* GET chatpublically listing. */
router.get('/', chatpublicallyController.createNotice);
/*Get chatprivately listing*/
router.get('/',chatprivatelyController.createNotice);
module.exports = router;