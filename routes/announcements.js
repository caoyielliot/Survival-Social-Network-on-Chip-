var express = require('express');
var router = express.Router();
var announcementController = require('../controllers/announcementController.js');

/* GET all announcements listing. */
router.get('/', announcementController.getAllAnnouncements);
router.post('/', announcementController.postAnnouncement);
router.post('/post_announcement', announcementController.postAnnouncement);

module.exports = router;