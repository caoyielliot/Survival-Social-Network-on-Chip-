"use strict";
module.exports = {
  createTable: function(db) {
    console.log("Creating private_messages table....");
    db.serialize(function() {
      db.run("CREATE TABLE private_messages("+
        "ID INTEGER PRIMARY KEY AUTOINCREMENT,"+
        "USERNAME1 CHAR(256) NOT NULL,"+
        "USERNAME2 CHAR(256) NOT NULL,"+
        "MESSAGE TEXT,"+
        "Timestamp DATETIME"+
      ")");
    });
  },

  getAllPrivateMessages: function(db,handler){
    var query = "SELECT USERNAME1,USERNAME2,MESSAGE,Timestamp FROM private_messages ORDER BY Timestamp DESC";
    var messages=[];
    db.each(query,function(error, row) {
      if (error) {
        handler(null, error);
      } else if (row) {
        messages.push(row);
      } else {
        handler();
      }
    }, function(){
      handler(messages,null);
    });
  },

  getPrivateMessage: function(db,handler,data){
    var name1=data["USERNAME1"];
    var name2=data["USERNAME2"];
    // console.log("getPrivateMessage!!!!!!");
    // console.log(name1);
    // console.log(name2);
    var messages=[];
    db.each("SELECT USERNAME1, MESSAGE, Timestamp FROM private_messages WHERE (USERNAME1=? AND USERNAME2=?) OR (USERNAME1=? AND USERNAME2=?) ", [name1, name2,name2,name1],function(error, row){
      if(error){
        console.log("Error SELECT PREVIOUS PRIVATE MESSAGES");
        handler(false,error);
      }else if(row.length===0){
        handler(false, null);
      }else{
        //handler(true,null);
        messages.push(row);
      }
    },function(){
        // console.log("messages!!!!");
        // for(var i=0;i<messages.length;i++){
        //   console.log(messages[i]);
        // };
        handler(messages,null);
      });
  },
  savePrivateMessage: function(db,handler,data){
    var name1=data["USERNAME1"];
    var name2=data["USERNAME2"];
    var text=data["MESSAGE"];
    var time=data["Timestamp"];
    // console.log(name1+":");
    // console.log(name2+":");
    // console.log(text);
    console.log("Inserting message into database...");
    db.run("INSERT INTO private_messages(USERNAME1, USERNAME2, MESSAGE, Timestamp) VALUES(?, ?, ?, ?)", [name1, name2,text,time], function(error){
      if(error){
        console.log("Error INSERT PRIVATE MESSAGES");
        handler(null,error);
      }else {
        handler(true,null);
      }
    });
   
  }


}