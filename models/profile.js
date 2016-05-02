var db = require('../db/db.js');

module.exports = {
	
	saveProfile: function(handler, data) {
	db.profile.saveProfile(db, handler, data);
	},

	getProfile: function(handler, data) {
	db.profile.getProfile(db, handler, data);
	}
	
}