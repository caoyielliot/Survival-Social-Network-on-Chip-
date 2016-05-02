var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController.js');

/* GET all messages listing. */
router.get('/public/:username', messageController.getAllMessages);

//GET the two users private message
router.get('/private/:username1/:username2',messageController.getPrivateMessages);
//Get all private messages
router.get('/private',messageController.getAllPrivateMessages);
//POST some user's message
router.post('/public/:username', messageController.postMessage);
//POST those two users' private message
router.post('/private/:username1/:username2',messageController.postPrivateMessages);
//DELETE messages from messages table
router.delete('/public/:username', messageController.deleteMessages);

module.exports = router;