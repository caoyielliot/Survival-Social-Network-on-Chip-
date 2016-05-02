var db = require('../db/db.js');

module.exports = {
	getAllAnnouncements: function(handler) {
		db.announcements.getAllAnnouncements(db, handler);
	}, 

	insertAnnouncement: function(handler, data) {
		db.announcements.insertAnnouncement(db, handler, data);
	}

}