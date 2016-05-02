angular.module('MessageService', [])
	.service('Message', function () {
		this.getCurrentMsg = function() {
			return this.currentMsg;
		};

		this.setCurrentMsg = function(theMsg) {
			this.currentMsg = theMsg;
		}
	})
	.factory('Message', function($http) {
		return {
			getAll: function() {
				return $http.get('/messages/public');
			},
			getMsg: function(){
				return $http.get('/messages/public/:username');
			} 
		}
	});