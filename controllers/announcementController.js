var Announcement = require('../models/announcement.js');
var User = require('../models/user.js');
var moment = require('moment');

module.exports = {
	getAllAnnouncements: function(req, res) {
 		Announcement.getAllAnnouncements(function (announcements, error) {
 			if (error) {
 				res.sendStatus(500);
 			} else {
 				res.status(200).send(announcements);
 			}
 		});
	},

	postAnnouncement: function(req, res) {
		var timestamp = moment().format('MM/DD/YYYY HH:mm:ss');
	    var data = {
	      "NAME": req.body.username,
	      "ANNOUNCEMENT": req.body.content,
	      "TIMESTAMP": timestamp
	    };
		var user = new User(req.body.username);
	    user.checkUserName(function (exist, error) {
      		if (error) {
        		res.status(500).send(error.message);
      		} else {
	        	if (exist) {
	          	// post message
		 			Announcement.insertAnnouncement(function (saved, error) {
			 			if (error) {
			 				res.status(500).send("Error writing announcement to database");
			 			} else {
			 				res.status(201).send("Announcement created");
			 			}
			 		}, data);
	        	} else {
	          	// user not registered
	          		res.status(404).send("User does not exist");
		          	console.log("User does not exist");
			    }
      		}
    }, data);
  }
};