angular.module('ChatPrivatelyService', [])
	.service('ChatPrivately', function () {
		this.getUsername = function() {
			return this.username;
		};

		this.setUsername = function(username) {
			this.username = username;
		};
	});