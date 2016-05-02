angular.module('UserService', [])
	.service('User', function () {
		this.getUsername = function() {
			return this.username;
		};
		this.setUsername = function(username) {
			this.username = username;
		};
		this.getPassword = function(){
			return this.password;
		};
		this.setPassword = function(password) {
			this.password = password;
		};
		this.getLoginorSignup = function() {
			return this.logintype;
		};
		this.setLoginorSignup = function(logintype) {
			this.logintype = logintype;
		};
		this.logout = function() {
			this.username = undefined;
			this.password = undefined;
			this.logintype = undefined;
		};
		this.setPrivilegeLevel = function(privilegeLevel) {
			this.privilegeLevel = privilegeLevel;
		};
		this.getPrivilegeLevel = function() {
			return this.privilegeLevel;
		};
	});