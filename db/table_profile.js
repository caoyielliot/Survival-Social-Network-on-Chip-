module.exports = {

	createTable: function(db) {
		console.log("Creating profiles table....");
		db.serialize(function() {
			db.run("CREATE TABLE profiles("+
        "ID INTEGER PRIMARY KEY AUTOINCREMENT,"+
        "originalName CHAR(256) NOT NULL,"+
        "givenName CHAR(256) NOT NULL,"+
        "surname  CHAR(256) NOT NULL,"+
        "streetAddress  CHAR(256) NOT NULL,"+
        "city CHAR(256) NOT NULL,"+
        "state CHAR(256) NOT NULL,"+
        "zip CHAR(256) NOT NULL,"+
        "image BLOB NOT NULL"+
      ")");

		});
	},
 
   

    saveProfile: function(db,handler,data){
       console.log("insert messages to the profiles table");
       var givenName=data.givenName;
       var surname=data.surname;
       var streetAddress=data.streetAddress;
       var state=data.state;
       var zip=data.zip;
       var city=data.city;
       var image=data.image;
       var originalName=data.originalName;
       console.log(originalName);
       db.run("INSERT INTO profiles(originalName, givenName, surname, streetAddress, city , state, zip, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [originalName, givenName, surname, streetAddress, city, state, zip, image], function(error){
      if(error){
        console.log("Error INSERT Profile");
        handler(null,error);
      }else {
        handler(true,null);
      }
    });

    },


    getProfile: function(db,handler,data){
      var originalName=data.originalName;
      console.log("get profile from db!!!");
      console.log(originalName);
      var profiles=[];
      db.each("SELECT givenName, surname, streetAddress, city ,state, zip, image FROM profiles WHERE (originalName=?) ORDER BY ID DESC LIMIT 1", [originalName],function(error, row){
      if(error){
        console.log("Error SELECT PREVIOUS Profile");
        handler(false,error);
      }else if(row.length===0){
        handler(false, null);
      }else{
        profiles.push(row);
      }
    },function(){
        handler(profiles,null);
      });
    }

};