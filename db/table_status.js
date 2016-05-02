module.exports = {
  createTable: function(db) {
    console.log("Creating STATUS table.");
    db.serialize(function() {
      db.run("CREATE TABLE STATUS ("+
        "ID INTEGER PRIMARY KEY AUTOINCREMENT,"+
        "USER_NAME CHAR(256) NOT NULL,"+
        "STATUS TEXT,"+
        "LOCATION CHAR(256)"+
      ")");
      db.run("INSERT INTO STATUS(USER_NAME, STATUS) VALUES ('SSNAdmin', 'Ok')");
    });
  },

  insertStatus: function(db, handler, data) {
    var user_name = data["USER_NAME"];
    var status = data["STATUS"];
    db.run("INSERT INTO STATUS(USER_NAME, STATUS) VALUES (?,?)", [user_name, status],
      function(error) {
        if (error) {
          handler(null, error);
        } else {
          handler(this.lastID, null);
        }
      }
    );
  },

  getStatus: function(db, handler, data) {
    var user_name = data["USER_NAME"];
    db.all("SELECT USER_NAME, STATUS FROM STATUS WHERE USER_NAME = ?", user_name,
      function(error, rows) {
        console.log(rows);
        if (error) {
          handler(null, error);
        } else {
          handler(rows[0], null);
        }
      }
    );
  },

  updateStatus: function(db, handler, data) {
    var user_name = data["USER_NAME"];
    var status = data["STATUS"];
    db.run("UPDATE STATUS SET STATUS = ? WHERE USER_NAME = ?", [status, user_name],
      function(error) {
        if (error) {
          handler(null, error);
        } else {
          handler(this.lastID, null);
        }
      }
    );
  },

    getLocation: function(db, handler, data) {
        var user_name = data["USER_NAME"];
        db.all("SELECT USER_NAME, LOCATION FROM STATUS WHERE USER_NAME = ?", user_name,
            function(error, rows) {
                console.log(rows);
                if (error) {
                    handler(null, error);
                } else {
                    handler(rows[0], null);
                }
            }
        );
    },

    updateLocation: function(db, handler, data) {
        var user_name = data["USER_NAME"];
        var location = data["LOCATION"];
        db.run("UPDATE STATUS SET LOCATION = ? WHERE USER_NAME = ?", [location, user_name],
            function(error) {
                if (error) {
                    handler(null, error);
                } else {
                    handler(this.lastID, null);
                }
            }
        );
    },

};