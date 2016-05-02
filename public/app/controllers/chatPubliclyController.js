angular.module('SSNoC')
	.config(['$compileProvider', function ($compileProvider) {
	    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data):/);
	}])
	.controller('chatPubliclyController', function ($scope, $filter, $http, User, socket) {
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

	 	$http.get('/messages/public/:username').then(function (response) {
      		$scope.messages = [];
      		for (var i = 0; i < response.data.length; i++) {
      			// check the message by regex
      			if(/^data:image\/png;base64.*/.test(response.data[i].MESSAGE)){
      				// the image matches the image
      				$scope.messages.push({
						USERNAME: response.data[i].USERNAME,
						Timestamp: response.data[i].Timestamp,
						image: response.data[i].MESSAGE
					});
      			} else {
      				// it is just a message
      				$scope.messages.push({
						USERNAME: response.data[i].USERNAME,
						Timestamp: response.data[i].Timestamp,
						MESSAGE: response.data[i].MESSAGE
					});
      			}
      		}
    	});

    	socket.on("message", function (message){
			$scope.messages.push({
				USERNAME: message.name,
				Timestamp: message.timestamp,
				MESSAGE: message.text
			});
		
		});

		$scope.sendMessage = function(){
			var username = User.getUsername();
			var message = $scope.currentMsg;
			var timestamp = new Date();
            
			socket.emit('message', {
				"name": username,
				"text": message,
				"timestamp": timestamp
			});

			$http.post('/messages/public/:username', {
				"username": username,
				"message": message,
				"timestamp": timestamp
			}, function() {
				console.log("Error posting message to database");
			});

			$scope.currentMsg = '';
		}

		function resizeImage(imputimgdataurl) {
			// from an input element
			var img = new Image;
			img.src = imputimgdataurl;
			// build a new canvas element
			console.log(imputimgdataurl);
			var canvas = document.createElement('canvas');

			var MAX_WIDTH = 240;
			var MAX_HEIGHT = 180;
			var width = img.width;
			var height = img.height;
			// Find the right scale
			scale = Math.min(MAX_HEIGHT/height, MAX_WIDTH/width);
			if (scale < 1){
				height *= scale;
				width *= scale;
			}
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);

			var dataurl = canvas.toDataURL("image/png");
			console.log(dataurl);
			// console.log(dataurl);
			return dataurl;
		}

		$scope.sendPicture = function(){
			console.log("The button is running");
			var m_image = $scope.data.image;	
			var r_image = resizeImage(m_image);
			// console.log(m_image);
			var username = User.getUsername();
			var timestamp = new Date();
			console.log(m_image);
			console.log(timestamp+"\t"+username);
			console.log(r_image);
			// socket emit
			socket.emit('image', {
				"name": username,
				"text": r_image,
				"timestamp": timestamp
			});
			// Save to database
			$http.post('/messages/public/:username', {
				"username": username,
				"message": r_image,
				"timestamp": timestamp
			}, function() {
				console.log("Error posting message to database");
			});
			// refresh data
			$scope.data.image='';
		}

		$scope.cancelPicture = function(){
			// refresh data
			$scope.data.image='';
		}


		socket.on("image", function (message){
			var img = new Image;
			img.src = message.text;
			$scope.messages.push({
				USERNAME: message.name,
				Timestamp: message.timestamp,
				image: message.text
			});
			// console.log(img);
			console.log(img.src);
		});
	})
	// reference: http://stackoverflow.com/questions/17063000/ng-model-for-input-type-file
	.directive("fileread", [function () {
	    return {
	        scope: {
	            fileread: "="
	        },
	        link: function (scope, element, attributes) {
	            element.bind("change", function (changeEvent) {
	                var reader = new FileReader();
	                reader.onload = function (loadEvent) {
	                    scope.$apply(function () {
	                        scope.fileread = loadEvent.target.result;
	                    });
	                }
	                reader.readAsDataURL(changeEvent.target.files[0]);
	            });
	        }
	    }
	}]);