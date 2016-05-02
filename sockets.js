module.exports = {
    listen: function (server) {
        var io = require('socket.io').listen(server);
        var client = {};
        // var locations = {};
        var locations = {test_user: {latitude: 37.4205018, longitude: -122.0596417}};

        var locked = false;

        /**
         * Event listener for Socket IO "listening" event.
         */

        io.on("connection", function (socket, data) {

            var socketID = socket.id;

            socket.on("connect", function () {
                console.log("User with socket ID " + socketID + " logged in");
            });

            socket.on('login', function (req) {
                client[req.user] = socketID;
            });

            socket.on('logout', function(req) {
                delete client[req.user];
            });

            socket.on('make_user_inactive', function(req) {
                if (req.user in client) {
                    io.to(client[req.user]).emit('logout', {});
                }
            });

            socket.on('message', function (message) {
                console.log("Message received " + message.text);
                io.emit('message', message);
            });

            socket.on('image', function (picture) {
                console.log("Picture received " + picture.text);
                io.emit('image',picture);
            })


            socket.on('send_priv_msg', function (message) {
                console.log("Private chat message received from" + message.sender + "content:" + message.text);
                io.to(client[message.recipient]).emit('rec_priv_msg', message);
            });

            socket.on('check_online', function (req) {
                if (req.user in client && client[req.user] !== null) {
                    req.online = "online";
                }
                else {
                    req.online = "offline";
                }
                console.log(req);
                io.to(socketID).emit('check_online', req);
            });

            socket.on('check_all_online', function (req){
                console.log(req);
                for (var i in req) {
                    if (req[i].USERNAME in client && client[req[i].USERNAME] !== null) {
                        req[i].USERONLINE = "online";
                    }
                    else {
                        req[i].USERONLINE = "offline";
                    }
                    console.log(req[i]);
                }
                io.to(socketID).emit('check_all_online', req);
            });

            socket.on('update_status', function (req) {
                // console.log(req);
                io.emit('update_status', req);
            });


            socket.on("disconnect", function () {
                console.log("User with socket ID " + socketID + " logged out");
                for (var user in client) {
                    if (client[user] === socketID) {
                        delete client[user];
                        delete locations[user];
                        break;
                    }
                }
            });

            socket.on("change_lock", function (req) {
                // auth logic
                locked = req.locked;
                io.emit("lock_status", req);
            });

            socket.on("check_lock_status", function (req) {
                io.to(socketID).emit("lock_status", {
                    locked: locked
                });
            });

            //socket for triggering test mode
            socket.on("test_mode", function(req) {
                if (req.testInProgress){
                  console.log(req.tester +" has commenced performance testing...");
                  var message = "System is unavailable!";
                  socket.broadcast.emit("system_lock", {
                    message: message,
                    systemAvailable: false
                  });
            }
            else {
                console.log("Testing complete..");
                var message = "System is now available!";
                socket.broadcast.emit("system_lock", {
                    message: message,
                    systemAvailable: true
                });
            }
        });

        // http://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error
        if (typeof(Number.prototype.toRad) === "undefined") {
            Number.prototype.toRadians = function() {
                return this * Math.PI / 180;
            };
        }

        //http://www.movable-type.co.uk/scripts/latlong.html
        var computeDistance = function(loc1, loc2) {
            var R = 6371000; // metres
            var φ1 = loc1.latitude.toRadians();
            var φ2 = loc2.latitude.toRadians();
            var Δφ = (loc2.latitude-loc1.latitude).toRadians();
            var Δλ = (loc2.longitude-loc1.longitude).toRadians();

            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            var d = R * c;
            return d;
        };

        socket.on("register_location", function(req) {
            console.log(req);
            var user_name = req.user_name;
            var location = req.location;
            var radius = req.radius;
            var nearby_users= [];
            var count = 0;
            locations[user_name] = location;
            for (var online_user in locations) {
                //check online_user's status...
                if (online_user !== user_name) {
                    var distance = computeDistance(location, locations[online_user]);
                    if (distance <= radius) {
                        nearby_users.push({
                            user_name: online_user,
                            distance: distance,
                            location: locations[online_user]
                        });
                        count = count + 1;
                        if (count >= 10)
                            break;
                    }
                }
            }
            io.to(socketID).emit("nearby_users", nearby_users);
        });

        socket.on("cancel_sharing", function(req) {
            var user_name = req.user_name;
            delete locations[user_name];
        });

      });
    }
};