angular.module('ProfileService', [])
	.service('Profile', function () {
		this.setProfile=function(profile){
            this.profile=profile;
		};
		this.getProfile=function(){
            return this.profile;
		};
	});