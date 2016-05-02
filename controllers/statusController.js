"use strict";

var User = require('../models/user.js');
var Status = require('../models/status.js');

module.exports = {
    getStatus: function (req, res) {
        // console.log(req.params.user_name);
        var user = new User(req.params.user_name);
        user.checkUserName(function (exists, error) {
            if (error) {
                res.status(500).send(error.message);
            } else if (exists) {
                var data = {
                    "USER_NAME": req.params.user_name
                };
                Status.getStatus(function (status, error) {
                    if (error) {
                        res.status(500).send(error.message);
                    } else {
                        res.status(200).send(status);
                    }
                }, data);
            } else {
                res.status(404).send("User does not exist");
            }
        });
    },

    updateStatus: function (req, res) {
        var user = new User(req.body.user_name);
        user.checkUserName(function (exists, error) {
            if (error) {
                res.status(500).send(error.message);
            } else if (exists) {
                var data = {
                    "USER_NAME": req.body.user_name,
                    "STATUS": req.body.status
                };
                Status.updateStatus(function (lastID, error) {
                    if (error) {
                        res.status(500).send(error.message);
                    } else {
                        res.status(200).send(req.body.status);
                    }
                }, data);
            } else {
                res.status(404).send("User does not exist");
            }
        });
    },
    getLocation: function (req, res) {
        // console.log(req.params.user_name);
        var user = new User(req.body.user_name);
        user.checkUserName(function (exists, error) {
            if (error) {
                res.status(500).send(error.message);
            } else if (exists) {
                var data = {
                    "USER_NAME": req.body.user_name
                };
                Status.getLocation(function (status, error) {
                    if (error) {
                        res.status(500).send(error.message);
                    } else {
                        res.status(200).send(status);
                    }
                }, data);
            } else {
                res.status(404).send("User does not exist");
            }
        });
    },

    updateLocation: function (req, res) {
        var user = new User(req.body.user_name);
        user.checkUserName(function (exists, error) {
            if (error) {
                res.status(500).send(error.message);
            } else if (exists) {
                var data = {
                    "USER_NAME": req.body.user_name,
                    "LOCATION": req.body.location
                };
                Status.updateLocation(function (lastID, error) {
                    if (error) {
                        res.status(500).send(error.message);
                    } else {
                        res.status(200).send(lastID);
                    }
                }, data);
            } else {
                res.status(404).send("User does not exist");
            }
        });
    }
};