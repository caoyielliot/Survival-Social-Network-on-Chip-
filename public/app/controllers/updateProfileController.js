angular.module('SSNoC')

.controller('updateProfileController', function($scope, $location, $http, $base64, ChatPrivately) {
  console.log("dsdsdssdsddsdssd");
    function resizeImage(imputimgdataurl) {
      // from an input element
      var img = new Image;
      img.src = imputimgdataurl;
      // build a new canvas element
      console.log(imputimgdataurl);
      var canvas = document.createElement('canvas');

      var MAX_WIDTH = 80;
      var MAX_HEIGHT = 80;
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
      console.log("After resize!!!");
      console.log(dataurl);
      // console.log(dataurl);
      return dataurl;
    }
  var originalName = ChatPrivately.getUsername();
   $http.get('/profile/' + originalName).then(function(response) {
        $scope.profile = response.data[0];
        // console.log($scope.profile);
        // console.log("blob");
        // console.log($scope.profile.image);
        // var file = $base64.decode($scope.profile.image);
        // console.log("decode file:")
        // console.log(file);
        // $scope.image_source = $base64.decode($scope.profile.image);
        $scope.image_source = $scope.profile.image;
      });

  $scope.updateProfile = function(profile) {
      console.log("photo");
      var originalName = ChatPrivately.getUsername();
      console.log("originalName");
      console.log(originalName);
      // var imageData = $base64.encode($scope.image_source);
      // console.log(imageData);
      // imageData=resizeImage(imageData);
      imageData = resizeImage($scope.image_source);
      console.log("here is the profile");
      console.log(profile);
      //post the profile to the database....
      var userProfile = profile.givenName + profile.surname;
     
      $http.post('/profile/' + userProfile, {
        "originalName": originalName,
        "givenName": profile.givenName,
        "surname": profile.surname,
        "streetAddress": profile.streetAddress,
        "city": profile.city,
        "state": profile.state,
        "zip": profile.zip,
        "image": imageData
          //"photo": profile.photo
      }, function() {
        console.log("Error posting profile to database");
      });
      $location.path('/lobby');
    },
    // reader.readAsDataURL(input.files[0]);
    $scope.setFile = function(element) {
      $scope.currentFile = element.files[0];
      var reader = new FileReader();

      reader.onload = function(event) {
          $scope.image_source = event.target.result
          $scope.$apply()

        }
        // when the file is read it triggers the onload event above.
      reader.readAsDataURL(element.files[0]);
    }



});