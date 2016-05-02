angular.module('SSNoC')


.controller('checkProfileController', function($scope, $location, $http, ChatPrivately, $base64) {
	var originalName = ChatPrivately.getUsername();
	console.log(originalName);
	$http.get('/profile/' + originalName).then(function(response) {
		$scope.profile = response.data[0];
		console.log($scope.profile);
		console.log("blob");
		console.log($scope.profile.image);
		var file = $base64.decode($scope.profile.image);
		console.log("decode file:")
		console.log(file);
		$scope.image_source=$base64.decode($scope.profile.image);
	});

});