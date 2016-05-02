"use strict";

var BaseModel = require("./base_model");

var User = function(username, password) {
    BaseModel.call(this);
    this.username = username;
    this.password = password;
};

// Copy static variables and functions
for (var i in BaseModel) {
    // Avoid copy undefined aka "prototoype"
    if (i !== undefined) {
        User[i] = BaseModel[i];
    }
}
// Copy instance functions
User.prototype = Object.create(BaseModel.prototype);

User.getAllUsers = function(handler) {
    this.db.users.getUsers(this.db, handler);
};

User.getActiveUsers = function(handler) {
    this.db.users.getActiveUsers(this.db, handler);
};

User.getInActiveUsers = function(handler) {
    this.db.users.getInActiveUsers(this.db, handler);
};

User.getUser = function(handler, id) {
    this.db.users.getUser(this.db, handler, {"ID": id});
};

User.currentUser = function(req) {
    return new User(req.session.currentUser.username, req.session.currentUser.password);
};

User.prototype.updateUserPrivilegeLevel = function(handler, userprivilege) {
    this.db.users.updateUserPrivilegeLevel(this.db, handler, {
        "NAME": this.username,
        "PRIVILEGELEVEL": userprivilege
    });
};

User.prototype.administrateUserProfile = function(handler, newName, newPassword, newAccountStatus, newPrivilegeLevel) {
    this.db.users.administrateUserProfile(this.db, handler, {
        "NAME": this.username,
        "NEW_NAME": newName,
        "PASSWORD": newPassword,
        "ACCOUNTSTATUS": newAccountStatus,
        "PRIVILEGELEVEL": newPrivilegeLevel
    });
};

User.prototype.checkUserName = function(handler) {
    this.db.users.checkUserName(this.db, handler, {"NAME": this.username});
};

User.prototype.updateUserAccountStatus = function(handler, accountstatus) {
    this.db.users.updateUserAccountStatus(this.db, handler, {
        "NAME": this.username,
        "ACCOUNTSTATUS": accountstatus
    });
};

User.prototype.insertUser = function(handler) {
    this.db.users.insertUser(this.db, handler, {
        "NAME": this.username,
        "PASSWORD": this.password
    });
};

User.prototype.validateUser = function(handler) {
    this.db.users.validateUser(this.db, handler, {
        "NAME": this.username,
        "PASSWORD": this.password
    });
};


User.prototype.setCurrentUser = function(req) {
    req.session.currentUser = this;
};


module.exports = User;