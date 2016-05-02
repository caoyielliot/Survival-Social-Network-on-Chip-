"use strict";

var db = require('../db/db.js');

module.exports = {
    getAllPrivateMessages: function(handler) {
        db.private_messages.getAllPrivateMessages(db, handler);
    },

    getPrivateMessage: function(handler, data){
        db.private_messages.getPrivateMessage(db,handler,data);
    },

    savePrivateMessage:function(handler, data){
        db.private_messages.savePrivateMessage(db,handler,data);
    },

    getSearchMessages:function(handler,data){
        db.messages.getSearchMessages(db,handler,data);
    }
};