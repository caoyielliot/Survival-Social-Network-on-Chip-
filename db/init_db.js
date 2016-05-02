var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();

module.exports = {
  createDB: function(db_path) {
    console.log("Initialize database " + db_path);
    var db = new sqlite3.Database(db_path);
    var exists = fs.existsSync(db_path);

    // REGISTER YOUR DB MODULES HERE!!!
    // module interface requirements:
    // module.create_table(db)
    db.users = require('../db/table_users.js');
    db.messages = require('../db/table_messages.js');
    db.private_messages = require('../db/table_private_messages.js');
    db.announcements = require('../db/table_announcements.js');
    db.status = require('../db/table_status.js');
    db.profile=require('../db/table_profile.js');
    if (!exists) {
      db.serialize(function() {
        db.users.createTable(db);
        db.messages.createTable(db);
        db.private_messages.createTable(db);
        db.announcements.createTable(db);
        db.status.createTable(db);
        db.profile.createTable(db);
      });
    }
    
    return db;
  },

  cleanDB: function(db_path) {
    console.log("Clean database " + db_path);
    var exists = fs.existsSync(db_path);

    // Clean db before running test
    if (exists) {
      fs.unlinkSync(db_path);
    }
  }
};