

var app = angular.module('SSNoC', ['ui.router', 'btford.socket-io', 
    'HomeService',
    'UserService',
    'SocketService',
    'ChatPrivatelyService',
    'SearchService',
    'base64',
    'NotificationService',
    'NavbarService',
    'MessageService',
    'ProfileService',
    'AdministratorUserProfileService',
    'ngSanitize'
]);


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/index.jade'
    })
    .state('lobby', {
      url: '/lobby',
      templateUrl: 'partials/lobby.jade'
    })
    .state('chatpublicly', {
      url: '/chatpublicly',
      templateUrl: 'partials/chatpublicly.jade'
    })
    .state('chatprivately', {
      url: '/chatprivately',
      templateUrl: 'partials/chatprivately.jade'
    })
    .state('postannouncement', {
      url: '/postannouncement',
      templateUrl: 'partials/postannouncement.jade'
    })
    .state('maintenance', {
      url: '/maintenance',
      templateUrl: 'partials/maintenance.jade'
    })
    .state('measurePerformance', {
      url: '/measurePerformance',
      templateUrl: 'partials/measurePerformance.jade'
    })
    .state('updateProfile', {
      url: '/updateProfile',
      templateUrl: 'partials/updateProfile.jade'
    })
    .state('searchResult', {
      url: '/searchResult',
      templateUrl: 'partials/searchResult.jade'
    })
    .state('checkProfile', {
      url: '/checkProfile',
      templateUrl: 'partials/checkProfile.jade'
    })
    .state('sharelocation', {
        url: '/sharelocation',
        templateUrl: 'partials/shareLocation.jade'
    })
      .state('administratorPage', {
          url: '/administratorPage',
          templateUrl: 'partials/administratorPage.jade'
      })
      .state('administratorUserProfile', {
          url: '/administratorUserProfile',
          templateUrl: 'partials/administratorUserProfile.jade'
      });
      $.material.init();
});

app.controller("SSNoCController", function($scope, $rootScope, $state, $location, socket) {
  // console.log("rootScope");
  $rootScope.$on("$stateChangeStart",
    function(event, toState, toParams, fromState, fromParams) {
      // console.log($scope, $rootScope, $state, $location);
    });
  $rootScope.$on("$stateChangeSuccess",
    function(event, toState, toParams, fromState, fromParams) {
      // console.log($scope, $rootScope, $state, $location);
      if ($location.$$url === "/lobby"){
        $scope.navLobby = "active";
      }
      else {
        $scope.navLobby = "";
        socket.removeAllListeners("check_online");
      }

      if ($location.$$url === "/chatpublicly") {
        $scope.navChatPublicly = "active";
      } else {
        $scope.navChatPublicly = "";
        socket.removeAllListeners("message");
      }
      if ($location.$$url === "/chatprivately") {
        $scope.navChatprivately = "active";
      } else {
        $scope.navChatprivately = "hide";
         socket.removeAllListeners("privatechat");
         socket.removeAllListeners("send_priv_msg");
         socket.removeAllListeners("rec_priv_msg");
      }

      if ($location.$$url === "/measurePerformance"){
        $scope.navMeasurePerf = "active";
      }
      else {
        $scope.navMeasurePerf = "";
      }

      if ($location.$$url === "/postannouncement")
        $scope.navPostAnnouncement = "active";
      else
        $scope.navPostAnnouncement = "";


        if ($location.$$url === "/sharelocation") {
            $scope.navShareLocation = "active";
        }
        else {
            $scope.navShareLocation = "";
            socket.removeAllListeners("nearby_users");
        }

        if ($location.$$url === "/administratorPage" || $location.$$url === "/administratorUserProfile") {
            $scope.navAdministerPage = "active";
        } else {
            $scope.navAdministerPage = "";
        }
    }
    );
});