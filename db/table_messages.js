"use strict";

module.exports = {

    createTable: function(db) {
        console.log("Creating messages table....");
        db.serialize(function() {
            db.run("CREATE TABLE messages("+
                "ID INTEGER PRIMARY KEY AUTOINCREMENT,"+
                "USERNAME CHAR(256) NOT NULL,"+
                "MESSAGE TEXT,"+
                "Timestamp DATETIME"+
                ")");
        });
    },
    
    deleteAllMessages: function(db, data) {
        console.log("Initiating delete from messages table....");
        db.serialize(function() {
            db.run("DELETE FROM messages");
        });
    },

    getMessages: function(db, handler) {
        var query = "SELECT USERNAME, MESSAGE, Timestamp FROM messages ORDER BY Timestamp ASC";
        var messages = [];
        db.each(query, function(error, row) {
            if (error) {
                handler(null, error);
            } else if (row) {
                messages.push(row);
            } else {
                handler();
            }
        }, function() {
            handler(messages, null);
        });
    },

    saveMessage: function(db, handler, data) {
        var name = data["NAME"];
        var text = data["MESSAGE"];
        var timestamp = data["Timestamp"];

        if (text === undefined || timestamp === undefined) {
            handler(null, new Error());
            return ;
        }
        // console.log("name:" + name);
        db.run("INSERT INTO messages(USERNAME, MESSAGE, Timestamp) VALUES(?, ?, ?)", [name, text, timestamp],
            function(error) {
                if (error) {
                    console.log("Error inserting into message table on database");
                    handler(null, error);
                } else {
                    handler(true, null);
                }
            });
    }
};