angular.module('SocketService', [])
	.factory('socket', function(socketFactory) {
		return socketFactory();
	}).
	value('version', '0.1');