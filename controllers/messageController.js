"use strict";

var User = require('../models/user.js');
var Message = require('../models/messages.js');
var PrivateMessage = require('../models/privateMessage.js');

module.exports = {

    deleteMessages: function (req, res) {
        Message.deleteAllMessages(function (saved, error) {
            if (error) {
                res.status(500).send("Error deleting from database");
            } else {
                res.status(201).send("Message deleted");
            }
        });

    },
    
    getAllMessages: function (req, res) {
        Message.getAllMessages(function (messages, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send(messages);
            }
        });
    },

    postMessage: function (req, res) {
        if (User.currentUser(req).username !== req.body.username) {
            res.status(500).send("User authentication failed.");
        } else {
            var message = new Message(User.currentUser(req).username, req.body.message, req.body.timestamp);
            message.saveMessage(function (saved, error) {
                if (error) {
                    res.status(500).send("Error writing message to database");
                } else {
                    res.status(201).send("Message created");
                }
            });
        }
    },

    getAllPrivateMessages: function (req, res) {
        PrivateMessage.getAllPrivateMessages(function (messages, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send(messages);
            }
        });
    },

    getPrivateMessages: function (req, res) {
        var data = {
            "USERNAME1": req.params.username1,
            "USERNAME2": req.params.username2
        };
        PrivateMessage.getPrivateMessage(function (messages, error) {
            if (error) {
                res.status(500).send("Error retrieving messages");
            } else {
                res.status(200).send(messages);
            }
        }, data);

    },

    postPrivateMessages: function (req, res) {
        console.log("posting private message:::");
        var data = {
            "USERNAME1": req.body.username1,
            "USERNAME2": req.body.username2,
            "MESSAGE": req.body.message,
            "Timestamp": req.body.timestamp
        };
        var user1 = new User(req.body.username1);
        user1.checkUserName(function (exist, error) {
            //whether username1 exists
            if (error) {
                res.status(500).send(error.message);
            } else {
                if (exist) {
                    //whether username2 exists
                    var user2 = new User(req.body.username2);
                    user2.checkUserName(function (exist, error) {
                        if (error) {
                            res.status(500).send(error.message);
                        } else {
                            if (exist) {
                                //save message
                                console.log("Calling saveMessage()...");
                                PrivateMessage.savePrivateMessage(function (saved, error) {
                                    if (error) {
                                        res.status(500).send("Error writing message to database");
                                    } else {
                                        res.status(201).send("Message created");
                                    }
                                }, data);
                            } else {
                                // user2 not registered
                                res.status(404).send("User does not exist");
                                console.log("User does not exist");
                            }
                        }
                    });
                } else {
                    // user1 not registered
                    res.status(404).send("User does not exist");
                    console.log("User does not exist");
                }
            }
        });
    }
};