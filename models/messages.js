"use strict";

var BaseModel = require("./base_model");

var Message = function(username, message, timestamp) {
    BaseModel.call(this);
    this.username = username;
    this.message = message;
    this.timestamp = timestamp;
};

// Copy static variables and functions
for (var i in BaseModel) {
    // Avoid copy undefined aka "prototoype"
    if (i !== undefined) {
        Message[i] = BaseModel[i];
    }
}
// Copy instance functions
Message.prototype = Object.create(BaseModel.prototype);

Message.deleteAllMessages = function(handler) {
    this.db.messages.deleteAllMessages(this.db, handler);
};

Message.getAllMessages = function(handler) {
    this.db.messages.getMessages(this.db, handler);
};

Message.prototype.saveMessage = function(handler) {
    this.db.messages.saveMessage(this.db, handler, {
        "NAME": this.username,
        "MESSAGE": this.message,
        "Timestamp": this.timestamp
    });
};

module.exports = Message;