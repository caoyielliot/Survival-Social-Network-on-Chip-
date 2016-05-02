var User = require('../models/user.js');
var Profile = require('../models/profile.js');

module.exports = {
		postProfile: function(req, res) {
			console.log("postProfile!!!!!");
			console.log(req.body);
			console.log(req.params);
			var data = {
				"originalName": req.body.originalName,
				"givenName": req.body.givenName,
				"surname": req.body.surname,
				"streetAddress": req.body.streetAddress,
				"city": req.body.city,
				"state": req.body.state,
				"zip": req.body.zip,
				"image": req.body.image
			};

			var user = new User(req.body.originalName);
			console.log("username::"+req.body.originalName);
			user.checkUserName(function(exist, error) {
						if (error) {
							res.status(500).send(error.message);
						} else {
							if (exist) {
								console.log("givenName!!!" + data.givenName);
								console.log("Calling saveProfile()...");

								Profile.saveProfile(function(saved, error) {
									if (error) {
										res.status(500).send("Error writing profile to database");
									} else {
										res.status(201).send("Profile created");
									}
								}, data);
							} else {
								res.status(404).send("User does not exist");
								console.log("User does not exist");
							}
						}
					});
				},
				getProfile: function(req, res) {
					var data = {
						"originalName": req.params.originalName
					};
					console.log(data.originalName);
					Profile.getProfile(function(profile, error) {
						if (error) {
							res.status(500).send("Error retrieving messages");
						} else {
							if (profile.length > 0)
								profile[0].i=req.query.i;
							console.log(profile);
							res.status(200).send(profile);
						}
					}, data);
				}
		};