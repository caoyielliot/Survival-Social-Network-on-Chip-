angular.module('HomeService', []).factory('HomeService', function($http) {
	return {
		login: function() {
			return $http.post('/login/');
		}
	}
});