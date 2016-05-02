angular.module('SSNoC')
  .controller('lobbyPageController', function($scope, $state, $location, User, socket) {
    $scope.username = User.getUsername();
    // console.log(User.getLoginorSignup());
    // console.log(User.getLoginorSignup() == "login");
    if (User.getLoginorSignup() == "login") {
      $scope.signuporlogin = "back "
    } else {
      $scope.signuporlogin = "newcomer "
    }

    socket.emit('login', {
      user: $scope.username
    });
	})

  .controller('directoryController', function ($scope, $http,$location, ChatPrivately, socket) {

    $http.get('/users').then(function (response) {
      $scope.users = response.data;
      for (var i in $scope.users) {
        $scope.users[i].ONLINE = "Checking online...";
        socket.emit('check_online', {
          "user": $scope.users[i].NAME,
          "index": i
        });
      }
    });

    $scope.sendUserName = function(targetUser){
      ChatPrivately.setUsername(targetUser);
      console.log("here is used to send username!");
      $location.path('/chatprivately');
    }

    socket.on('check_online', function(user) {
      $scope.users[user.index].ONLINE = user.online;
    });

    socket.on('update_status', function(user) {
      for (var i in $scope.users) {
        if ($scope.users[i].NAME === user.user_name) {
          $scope.users[i].STATUS = user.status;
          break;
        }
      }
    })

    
   

  });
