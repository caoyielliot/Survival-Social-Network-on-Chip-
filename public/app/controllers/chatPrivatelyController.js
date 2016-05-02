angular.module('SSNoC')
	.controller('chatPrivatelyController', function($scope, $filter, $http, User, socket, ChatPrivately) {

		var username1 = User.getUsername();
		var username2 = ChatPrivately.getUsername();

		socket.on("connect", function (){
			console.log("User connected via Socket io!");
		});

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

		$http.get('/messages/private/' + username1 + '/' + username2).then(function(response) {
			$scope.messages = response.data;
			console.log($scope.messages);
		});

		socket.on('rec_priv_msg', function(message) {
			$scope.messages.push({
				USERNAME1: message.sender,
				Timestamp: message.timestamp,
				MESSAGE: message.text
			});
		});

		$scope.sendMessage = function() {
			var username1 = User.getUsername();
			var username2 = ChatPrivately.getUsername();
			var message = $scope.currentMsg;
			var timestamp = new Date();
			
			socket.emit('send_priv_msg', {
				sender: username1,
				recipient: username2,
				text: message,
				timestamp: timestamp
			});

			$scope.messages.push({
				USERNAME1: username1,
				Timestamp: timestamp,
				MESSAGE: message
			});
			$http.post('/messages/private/' + username1 + '/' + username2,  {
				"username1": username1,
				"username2": username2,
				"message": message,
				"timestamp": timestamp

			}, function() {
				console.log("Error posting message to database");
			});

			$scope.currentMsg = '';
		}
	});