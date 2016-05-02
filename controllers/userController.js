"use strict";

var User = require('../models/user');
var Status = require('../models/status');

module.exports = {
    getAllUsers: function (req, res) {
        User.getAllUsers(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send(users);
            }
        });
    },

    getAllActiveUsers: function (req, res) {
        User.getActiveUsers(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send(users);
            }
        });
    }, 

    getAllInActiveUsers: function (req, res) {
        User.getInActiveUsers(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send(users);
            }
        });
    },

    currentUser: function (req, res) {
        console.log(req.session.currentUser);
        if (req.session.currentUser !== undefined) {
            res.status(200).send({
                username: req.session.currentUser.username,
                privilege_level: req.session.currentUser.privilegeLevel
            });
        } else {
            res.sendStatus(500);
        }
    },

    setUserActive: function (req, res) {
        var user = new User(req.params.username, "password");
        user.updateUserAccountStatus(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send("User is set Active");
            }
        }, "Active");
    },

    setUserInActive: function (req, res) {
        var user = new User(req.params.username, "password");
        user.updateUserAccountStatus(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send("User is set Inactive");
            }
        }, "Inactive");
    },

    setUserPrivilegeAsCitizen: function (req, res) {
        var user = new User(req.params.username, "password");
        user.updateUserPrivilegeLevel(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send("User is set as Citizen");
            }
        }, "Citizen");
    },

    setUserPrivilegeAsCoordinator: function (req, res) {
        var user = new User(req.params.username, "password");
        user.updateUserPrivilegeLevel(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send("User is set as Coordinator");
            }
        }, "Coordinator");
    },

    setUserPrivilegeAsMonitor: function (req, res) {
        var user = new User(req.params.username, "password");
        user.updateUserPrivilegeLevel(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send("User is set as Monitor");
            }
        }, "Monitor");
    },

    setUserPrivilegeAsAdministrator: function (req, res) {
        var user = new User(req.params.username, "password");
        user.updateUserPrivilegeLevel(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send("User is set as Administrator");
            }
        }, "Administrator");
    },

    administrateUserProfile: function(req, res) {
        var user = new User(req.body.userName, "password");
        var newName = req.body.newName;
        var newPassword = req.body.password;
        var newAccountStatus = req.body.accountStatus;
        var newPrivilegeLevel = req.body.privilegeLevel;
        user.administrateUserProfile(function(success, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                res.status(200).send("User profile updated");
            }
        }, newName, newPassword, newAccountStatus, newPrivilegeLevel);
    },

    checkUserName: function(req, res) {
        var user = new User(req.params.username);
        user.checkUserName(function(exist, error) {
            if (error) {
                res.status(500).send(error.message);
            } else {
                if (exist) {
                    res.status(200).send("User exists.");
                } else {
                    res.status(404).send("User does not exist.");
                }
            }
        });
    },

    loginOrSignup: function (req, res) {
        // console.log(req.body.username);
        // console.log(req.body.password);
        var user = new User(req.body.username, req.body.password);

        user.checkUserName(function (exist, error) {
            if (error) {
                res.status(500).send(error.message);
            } else {
                if (exist) {
                    // login
                    user.validateUser(function (validate_result, error) {
                        if (error) {
                            res.status(500).send(error.message);
                        } else {
                            if (validate_result !== false) {
                                user.privilegeLevel = validate_result["PRIVILEGELEVEL"];
                                user.setCurrentUser(req);
                                res.status(200).send("login");
                            } else {
                                res.status(500).send("User authentication failed.");
                            }
                        }
                    });
                } else {
                    // signup
                    user.insertUser(function (lastID, error) {
                        if (error) {
                            res.status(500).send(error.message);
                        } else {
                            Status.insertStatus(function (lastID, error) {
                                if (error) {
                                    res.status(500).send(error.message);
                                } else {
                                    user.privilegeLevel = "Citizen";
                                    user.setCurrentUser(req);
                                    res.status(201).send("signup");
                                }
                            }, {"USER_NAME": req.body.username, "STATUS": "Undefined"});
                        }
                    });
                }
            }
        });
    }
};