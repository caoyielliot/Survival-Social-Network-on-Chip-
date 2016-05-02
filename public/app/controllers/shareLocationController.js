"use strict";

// http://en.marnoto.com/2014/04/converter-coordenadas-gps.html
// This function returns the coordinate
// conversion string in DD to DMS.
function ddToDms(lat, lng) {

    var latResult, lngResult, dmsResult;

    lat = parseFloat(lat);
    lng = parseFloat(lng);

    // Call to getDms(lat) function for the coordinates of Latitude in DMS.
    // The result is stored in latResult variable.
    latResult = getDms(lat);
    latResult += (lat >= 0)? 'N' : 'S';

    // Call to getDms(lng) function for the coordinates of Longitude in DMS.
    // The result is stored in lngResult variable.
    lngResult = getDms(lng);
    lngResult += (lng >= 0)? 'E' : 'W';

    // Joining both variables and separate them with a space.
    dmsResult = latResult + ', ' + lngResult;

    // Return the resultant string
    return dmsResult;
}

function getDms(val) {

    var valDeg, valMin, valSec, result;

    val = Math.abs(val);

    valDeg = Math.floor(val);
    result = valDeg + "º";

    valMin = Math.floor((val - valDeg) * 60);
    result += valMin + "'";

    valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;
    result += valSec + '"';

    return result;
}

// https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(lat, lng) {
    var siny = Math.sin(lat * Math.PI / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return {x: 0.5 + lng / 360, y: 0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)};
}

function drawRadar(origin, radius, locations) {
    var canvas = document.getElementById("radar");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "10px Arial";
    for (var i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(300,300,300 * (i + 1) / 5,0,2*Math.PI);
        ctx.stroke();
        ctx.fillText(i * radius / 5 + "m", 300, 310 + 60 * i);
    }
    $("#radar_wrapper").append(
        "<div style=\"position: absolute;bottom:300px;left:300px;\">"+
        "<span class=\"glyphicon glyphicon-map-marker\" aria-hidden=\"true\"></span><b>You</b></div>");
    var originxy = project(origin.latitude, origin.longitude);
    for (var i in locations) {
        var xy = project(locations[i].location.latitude, locations[i].location.longitude);
        var px = (xy.x - originxy.x) * 31581778 / radius * 300;
        var py = (xy.y - originxy.y) * 31581778 / radius * 300;
        console.log("px: " + px + ", py: " + py);
        locations[i].dms=ddToDms(locations[i].location.latitude, locations[i].location.longitude);
        console.log(locations[i].dms);
        $("#radar_wrapper").append(
            "<div class=\"marker\" style=\"position: absolute;bottom:"+(300+py)+"px;left:"+(300+px)+"px;\">"+
            "<span class=\"glyphicon glyphicon-map-marker\" aria-hidden=\"true\"></span><b>"+locations[i].user_name+": "+locations[i].distance.toFixed(2)+"m away</b></div>");
    }
}

angular.module('SSNoC')
    .controller('shareLocationController', function($scope, $http, $location, User, socket, ChatPrivately) {
        $scope.shareForm = "hidden";
        $scope.shareFormNotAvailable = "hidden";
        $scope.canNotRetrieveLocation = "hidden";
        $scope.yourLocation = "hidden";
        if ("geolocation" in navigator) {
            /* geolocation is available */
            $scope.shareForm = "";
        } else {
            /* geolocation IS NOT available */
            $scope.shareFormNotAvailable = "";
        }

        // initialize radius
        $scope.helpRadius = "Please input a number between 1 to 10,000.";
        $scope.validateRadius = function() {
            if ($scope.radius === "" || parseInt($scope.radius) < 1 || parseInt($scope.radius) > 5000) {
                $scope.helpRadius = "Please input a number between 1 to 5000.";
                $scope.shareButton = "disabled";
            } else {
                $scope.helpRadius = "";
                $scope.shareButton = "";
            }
        };

        $scope.registerLocation = function(refresh) {
            if (refresh === true) {
                $scope.dms = "refreshing...";
            } else {
                $scope.dms = "loading...";
            }
            $(".marker").remove();
            navigator.geolocation.getCurrentPosition(function(position) {
                // http://www.jeffryhouser.com/index.cfm/2014/6/2/How-do-I-run-code-when-a-variable-changes-with-AngularJS
                $scope.$apply(function() {
                    $scope.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log("get location: " + $scope.location.latitude + ", " + $scope.location.longitude);
                    $scope.dms = ddToDms($scope.location.latitude, $scope.location.longitude);
                    socket.emit("register_location", {
                        user_name: User.getUsername(),
                        location: $scope.location,
                        radius: $scope.radius
                    });
                    $http.post("/status/save_location", {
                        "user_name": User.getUsername(),
                        "location": $scope.dms
                    }).then(function(response) {
                        // nothing to do
                    }, function(error) {});
                });
            }, function() {
                $scope.canNotRetrieveLocation = "";
            });
            $scope.yourLocation = "";
        };
        
        $scope.cancelSharing = function() {
            socket.emit("cancel_sharing", {
                user_name: User.getUsername()
            });
            $location.path("/lobby");
        };

        $scope.sendUserName = function (targetUser) {
            ChatPrivately.setUsername(targetUser);
            $location.path('/chatprivately');
        };
        
        socket.on("nearby_users", function(res) {
            drawRadar($scope.location, $scope.radius, res);
                console.log(res);
                for (var i in res) {
                res[i].dms = ddToDms(res[i].location.latitude, res[i].location.longitude);
                
                $http.get("/status/" + res[i].user_name).then(function(response) {
                   console.log(response.data);
                   res[i].STATUS=response.data.STATUS;
                });   
                $scope.$apply(function() {$scope.nearby_users = res;});
            
            }
        });
    });