module.exports = {

  createTable: function(db) {
    console.log("Creating announcements table....");
    db.serialize(function() {
      db.run("CREATE TABLE announcements("+
        "ID INTEGER PRIMARY KEY AUTOINCREMENT,"+
        "USERNAME CHAR(256) NOT NULL,"+
        "ANNOUNCEMENT TEXT,"+
        "TIMESTAMP DATETIME"+
      ")");
    });
  },

  getAllAnnouncements: function(db,handler){
    var announcements=[];
    var query = "SELECT USERNAME, ANNOUNCEMENT, TIMESTAMP FROM announcements ORDER BY TIMESTAMP ASC";
    db.each(query, function(error, row){
      if(error){
        console.log("Error SELECT PREVIOUS ANNOUNCEMENTS");
        handler(false,error);
      }else if(row){
        announcements.push(row);
      }else{
        handler();
      }
    }, function(){
      handler(announcements,null);
    });
  }, 

  insertAnnouncement: function(db, handler, data){
    var username = data["NAME"];
    var announcement = data["ANNOUNCEMENT"];
    var timestamp = data["TIMESTAMP"];
    var query = "INSERT INTO announcements(USERNAME, ANNOUNCEMENT, TIMESTAMP) VALUES(?,?,?)"; 
    db.run(query,[username, announcement, timestamp], 
      function(error) {
        if (error) {
          handler("InsertError", error);
        } else {
          handler("InsertedAnnouncement",null);
        }
    });
  }
}

