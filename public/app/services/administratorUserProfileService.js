angular.module('AdministratorUserProfileService', [])
    .service('AdministratorUserProfile', function () {
        this.getUserName = function() {
            return this.userName;
        };

        this.setUserName = function(userName) {
            this.userName = userName;
        };

        this.getAccountStatus = function() {
            return this.accountStatus;
        };

        this.setAccountStatus = function(accountStatus) {
            this.accountStatus = accountStatus;
        };

        this.getPrivilegeLevel = function() {
            return this.privilegeLevel;
        };

        this.setPrivilegeLevel = function(privilegeLevel) {
            this.privilegeLevel = privilegeLevel;
        };
    });