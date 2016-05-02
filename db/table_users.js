"use strict";
var md5 = require('crypto-js/md5');

module.exports = {

    createTable: function (db) {
        console.log("Creating USERS table.");
        var adminpassword = md5("admin");
        db.serialize(function () {
            db.run("CREATE TABLE USERS (" +
                "ID INTEGER PRIMARY KEY AUTOINCREMENT," +
                "NAME CHAR(256) NOT NULL," +
                "PASSWORD CHAR(256) NOT NULL," +
                "ACCOUNTSTATUS CHAR(256) NOT NULL," + 
                "PRIVILEGELEVEL CHAR(256) NOT NULL" + 
                ")");
            db.run("INSERT INTO USERS (NAME, PASSWORD, ACCOUNTSTATUS, PRIVILEGELEVEL) VALUES ('SSNAdmin','"+adminpassword+"','Active','Administrator')");

        });
    },

    updateUserAccountStatus: function(db, handler, data) {
        // update the status for the user's account
        console.log("Changing Users Account Status");
        var name = data["NAME"];
        var newAccountStatus = data["ACCOUNTSTATUS"];
        // console.log(name);
        // console.log(newAccountStatus);
        db.serialize(function() {
            db.run("UPDATE USERS SET ACCOUNTSTATUS=? WHERE NAME=?", [newAccountStatus,name], 
                function (error) {
                    if (error) {
                        handler(null, error);
                    } else {
                        handler(true, null);
                    }
                });
        });
    },


    updateUserPrivilegeLevel: function(db, handler, data) {
        // Update the privilege for the user
        console.log("Changing Users privilege");
        var name = data["NAME"];
        var newname = data["NEW_NAME"];
        var newpassword = data["PASSWORD"];
        var newPrivilegelevel = data["PRIVILEGELEVEL"];
        var admincount = 1;
        var oldprivilegelevel = "Citizen";
        db.serialize(function () {
            // First check the number of admins
            db.all("SELECT COUNT(*) AS ADMINCOUNT FROM USERS WHERE PRIVILEGELEVEL='Administrator'",
                function (error, rows) {
                    if (error) {
                        handler(null, error);
                    } else if (rows.length === 0) {
                        handler(null, new Error("No Administrator"));
                    } else {
                        admincount = rows[0]["ADMINCOUNT"];
                        // console.log("database read admin number" + admincount);
                    }
                });
            // console.log("after get the admin number" + admincount);
            // Then check whether the function is trying the degrade an admin
            db.all("SELECT PRIVILEGELEVEL FROM USERS WHERE NAME=?", name, 
                function (error,rows) {
                    if (error) {
                        handler(null, error);
                    } else if (rows.length === 0) {
                        handler(null, new Error("Error in checking PRIVILEGE LEVEL"));
                    } else {
                        oldprivilegelevel = rows[0]["PRIVILEGELEVEL"];
                        // console.log("database read old privilege level" + oldprivilegelevel);
                        // console.log("after get the old privilege" + oldprivilegelevel);
                        if (oldprivilegelevel === "Administrator" && newPrivilegelevel !== "Administrator" && admincount === 1) {
                            // The system has only one administrator and was trying to degrade it.
                            handler(null, new Error("System should have at least one administrator"));
                        } else {
                            // Then get the privilege changed
                            db.run("UPDATE USERS SET PRIVILEGELEVEL=? WHERE NAME=?", [newPrivilegelevel,name],
                                function (error) {
                                    if (error) {
                                        handler(null, error);
                                    } else {
                                        handler(true, null);
                                    }
                                });
                        }
                    }
                });
            
        });
    },

    administrateUserProfile: function(db, handler, data) {
        // Update the privilege for the user
        console.log("Changing Users privilege");
        var name = data["NAME"];
        var newName = data["NEW_NAME"];
        var newPassword = "";
        if ("PASSWORD" in data && data["PASSWORD"] !== "")
            newPassword = md5(data["PASSWORD"]).toString();
        var newAccountStatus = data["ACCOUNTSTATUS"];
        var newPrivilegelevel = data["PRIVILEGELEVEL"];

        var admincount = 1;
        var oldprivilegelevel = "Citizen";
        db.serialize(function () {
            // First check the number of admins
            db.all("SELECT COUNT(*) AS ADMINCOUNT FROM USERS WHERE PRIVILEGELEVEL='Administrator'",
                function (error, rows) {
                    if (error) {
                        handler(null, error);
                    } else if (rows.length === 0) {
                        handler(null, new Error("No Administrator"));
                    } else {
                        admincount = rows[0]["ADMINCOUNT"];
                        // console.log("database read admin number" + admincount);
                    }
                });
            // console.log("after get the admin number" + admincount);
            // Then check whether the function is trying the degrade an admin
            db.all("SELECT PRIVILEGELEVEL FROM USERS WHERE NAME=?", name,
                function (error,rows) {
                    if (error) {
                        handler(null, error);
                    } else if (rows.length === 0) {
                        handler(null, new Error("Error in checking PRIVILEGE LEVEL"));
                    } else {
                        oldprivilegelevel = rows[0]["PRIVILEGELEVEL"];
                        // console.log("database read old privilege level" + oldprivilegelevel);
                        // console.log("after get the old privilege" + oldprivilegelevel);
                        if (oldprivilegelevel === "Administrator" && newPrivilegelevel !== "Administrator" && admincount === 1) {
                            // The system has only one administrator and was trying to degrade it.
                            handler(null, new Error("System should have at least one administrator"));
                        } else {
                            db.serialize(function() {
                                if (newName !== name){
                                    // Need to change every single database with username
                                    db.run("UPDATE announcements SET USERNAME=? WHERE USERNAME=?", [newName, name],
                                        function (error) {
                                        });
                                    // public message
                                    db.run("UPDATE messages SET USERNAME=? WHERE USERNAME=?", [newName, name],
                                        function (error) {
                                        });
                                    // private message
                                    db.run("UPDATE private_messages SET USERNAME1=? WHERE USERNAME1=?", [newName, name],
                                        function (error) {
                                        });
                                    // private message
                                    db.run("UPDATE private_messages SET USERNAME2=? WHERE USERNAME2=?", [newName, name],
                                        function (error) {
                                        });
                                     // user status
                                    db.run("UPDATE STATUS SET USER_NAME=? WHERE USER_NAME=?", [newName, name],
                                        function (error) {});
                                }

                                // The name is changing, need to change name in every database
                                if (newPassword === "") {
                                    db.run("UPDATE USERS SET PRIVILEGELEVEL=?, NAME=?, ACCOUNTSTATUS=? WHERE NAME=?", [newPrivilegelevel, newName, newAccountStatus, name],
                                        function (error) {
                                            if (error) {
                                                handler(null, error);
                                            } else {
                                                handler(true, null);
                                            }
                                        });
                                } else {
                                    db.run("UPDATE USERS SET PRIVILEGELEVEL=?, NAME=?, PASSWORD=?, ACCOUNTSTATUS=? WHERE NAME=?", [newPrivilegelevel, newName, newPassword, newAccountStatus, name],
                                        function (error) {
                                             if (error) {
                                                handler(null, error);
                                            } else {
                                                handler(true, null);
                                            }
                                        });
                                }

                            });
                        }
                    }
                });

        });
    },


    getActiveUsers: function (db, handler) {
        console.log("Getting all active users");
        var query = "SELECT USERS.ID, USERS.NAME, USERS.PRIVILEGELEVEL, USERS.ACCOUNTSTATUS, STATUS.STATUS, STATUS.LOCATION FROM USERS JOIN STATUS ON (USERS.NAME = STATUS.USER_NAME) WHERE USERS.ACCOUNTSTATUS='Active' ORDER BY USERS.ID";
        var users = [];
        db.each(query,
            function (error, row) {
                if (error) {
                    handler(null, error);
                } else if (row) {
                    users.push(row);
                } else {
                    handler(null, new Error("Error get active users"));
                }
            }, function () {
                handler(users, null);
                console.log(users);
            }
        );
    },

    getInActiveUsers: function (db, handler) {
        console.log("Getting all inactive users");
        var query = "SELECT USERS.ID, USERS.NAME, USERS.PRIVILEGELEVEL, USERS.ACCOUNTSTATUS, STATUS.STATUS, STATUS.LOCATION FROM USERS JOIN STATUS ON (USERS.NAME = STATUS.USER_NAME) WHERE USERS.ACCOUNTSTATUS='Inactive' ORDER BY USERS.ID";
        var users = [];
        db.each(query,
            function (error, row) {
                if (error) {
                    handler(null, error);
                } else if (row) {
                    users.push(row);
                } else {
                    handler(null, new Error("Error get active users"));
                }
            }, function () {
                handler(users, null);
                console.log("Inactive users:")
                console.log(users);
            }
        );
    },

    getUsers: function (db, handler) {
        var query = "SELECT USERS.ID, USERS.NAME, USERS.PRIVILEGELEVEL, USERS.ACCOUNTSTATUS, STATUS.STATUS, STATUS.LOCATION FROM USERS JOIN STATUS ON (USERS.NAME = STATUS.USER_NAME) ORDER BY NAME";
        var users = [];
        db.each(query,
            function (error, row) {
                if (error) {
                    handler(null, error);
                } else if (row) {
                    users.push(row);
                } else {
                    handler(null, new Error("Ce la vie."));
                }
            }, function () {
                handler(users, null);
                console.log(users);
            }
        );
    },

    checkUserName: function (db, handler, data) {
        var name = data["NAME"];
        db.all("SELECT * FROM USERS WHERE NAME=?", name,
            function (error, rows) {
                if (error) {
                    handler(null, error);
                } else if (rows.length !== 0) {
                    handler(true, null); // user does not exist
                } else {
                    handler(false, null); // user exist
                }
            });
    },

    insertUser: function (db, handler, data) {
        var name = data["NAME"];
        // console.log(name);
        var password = md5(data["PASSWORD"]).toString();
        // console.log(password.toString());
        db.serialize(function () {
            db.all("SELECT * FROM USERS WHERE NAME=?", name,
                function (error, rows) {
                    if (error) {
                        handler(null, error);
                    } else if (rows.length !== 0) {
                        handler(null, new Error("User name has been used"));
                    }
                });
            // console.log("call insert!");
            db.run("INSERT INTO USERS(NAME, PASSWORD, ACCOUNTSTATUS, PRIVILEGELEVEL) VALUES(?, ?, 'Active', 'Citizen')", [name, password],
                function (error) {
                    if (error) {
                        handler(null, error);
                    } else {
                        handler(this.lastID, null);
                    }
                });
        });
    },

    getUser: function (db, handler, data) {
        var id = data["ID"];
        db.all("SELECT NAME, ACCOUNTSTATUS, PRIVILEGELEVEL FROM USERS WHERE ID=?", id, function (error, rows) {
            if (error) {
                handler(null, error);
            } else if (rows.length === 0) {
                handler(null, new Error("User does not exist"));
            } else {
                handler(rows[0], null);
            }
        });
    },

    validateUser: function (db, handler, data) {
        var name = data["NAME"];
        var password = md5(data["PASSWORD"]).toString();
        // console.log(name);
        // console.log(password.toString());
        db.all("SELECT ID, NAME, PRIVILEGELEVEL FROM USERS WHERE NAME=? AND PASSWORD=? AND ACCOUNTSTATUS='Active'", name, password, function (error, rows) {
            // console.log(rows);
            if (error) {
                handler(false, error);
            } else if (rows.length === 0) {
                handler(false, null);
            } else {
                handler(rows[0], null);
            }
        });
    }
}