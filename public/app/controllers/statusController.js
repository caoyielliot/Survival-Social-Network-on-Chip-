angular.module('SSNoC')
  .controller('statusController', function($scope, $filter, $http, $timeout, User, socket) {
    $scope.fetchStatus = function() {
      $http.get("/status/" + User.getUsername()).then(function(response) {
        // console.log(response.data);
        var data = response.data;
        var status = response.data["STATUS"];
        switch (status) {
          case "Undefined":
            $scope.statusMessage = "The user has not been providing her status yet.";
            break;
          case "Ok":
            $scope.statusMessage =
              "<img style=\"width: 25px; height: 25px;\" src=\"/images/"+status+".png\"></img> " +
              "I am OK, I do not need help.";
            break;
          case "Help":
            $scope.statusMessage =
              "<img style=\"width: 25px; height: 25px;\" src=\"/images/"+status+".png\"></img> " +
              "I need help, but this is not a life threatening emergency.";
            break;
          case "Emergency":
            $scope.statusMessage = 
              "<img style=\"width: 25px; height: 25px;\" src=\"/images/"+status+".png\"></img> " +
              "I need help now, as this is a life threatening emergency!";
            break;
        }
      }, function(response) {
        // alert(response.data);
      });
    };

    $scope.updateStatus = function() {
      $http.post("/status", {
        'user_name': User.getUsername(),
        'status': $scope.status
      }).then(function(response) {
        $scope.fetchStatus();
      }, function(response) {
        alert(response.data);
      });

      socket.emit("update_status", {
        'user_name': User.getUsername(),
        'status': $scope.status
      });
    };

    if (User.getUsername() == undefined) 
      setTimeout(function() {$scope.fetchStatus()}, 3000);
  });