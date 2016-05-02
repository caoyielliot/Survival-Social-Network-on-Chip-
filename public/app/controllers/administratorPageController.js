angular.module('SSNoC')
    .controller('administratorPageController', function($scope, $location, $http, socket, AdministratorUserProfile) {
        $http.get('/users').then(function(response) {
            $scope.users = response.data;
        });
        $scope.administrate = function(name, accountstatus, privilegelevel) {
            AdministratorUserProfile.setUserName(name);
            AdministratorUserProfile.setAccountStatus(accountstatus);
            AdministratorUserProfile.setPrivilegeLevel(privilegelevel);
            $location.url("/administratorUserProfile");
        };
    });
