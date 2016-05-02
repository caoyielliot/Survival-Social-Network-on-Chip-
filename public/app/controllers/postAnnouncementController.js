angular.module('SSNoC')
    .controller('postAnnouncementController', function ($scope, $filter, $http, User, socket) {

        // retrieve all the historical announcement from the database
        $http.get('/announcements').then(function (response) {
            if (typeof response.data !== 'undefined') {
                $scope.datas = response.data;
            }
        });


        // When post a new announcement, what should I do to let others know?
        $scope.postAnnouncement = function () {
            var username = User.getUsername();
            var announcement = $scope.currentData;
            // var timestamp = $filter('date')(message.timestamp, 'MM/dd/yyyy HH:mm:ss');
            var timestamp = Date();
            timestamp = moment().format('MM/DD/YYYY HH:mm:ss');

            // check the router part for sending out the post request
            $http.post('/announcements/post_announcement', {
                "username": username,
                "content": announcement,
                "timestamp": timestamp

            }).then(function (response) {
                $scope.datas.push({
                    USERNAME: username,
                    ANNOUNCEMENT: announcement,
                    TIMESTAMP: timestamp
                });
            }, function () {
                console.log("Error posting announcement to database");
            });

            // Empty the input for future use
            $scope.currentData = '';

        };

        socket.on("system_lock", function(req) {
          // redirect client to maintenance page logic if test is ongoing
          if (!req.systemAvailable){
            console.log(req.message);
            $location.path('/maintenance');
          } 
          else{
            //client can access application now
            console.log(req.message);
          }
        });
    });