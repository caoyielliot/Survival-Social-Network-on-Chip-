angular.module('SSNoC')
	.controller('homePageController', function ($scope, $http, $state, $location, HomeService, User, socket) {
		$scope.username = '';
		$scope.password = '';
		// $scope.loginForm.username.$setValidity("minlength",$scope.username.length>3);
		$scope.validation = {
			username: function() {
				var userlen = $scope.username.length;
				var savekeywords = $scope.username.match(/^about$|^access$|^account$|^accounts$|^add$|^address$|^adm$|^admin$|^administration$|^adult$|^advertising$|^affiliate$|^affiliates$|^ajax$|^analytics$|^android$|^anon$|^anonymous$|^api$|^app$|^apps$|^archive$|^atom$|^auth$|^authentication$|^avatar$|^backup$|^banner$|^banners$|^bin$|^billing$|^blog$|^blogs$|^board$|^bot$|^bots$|^business$|^chat$|^cache$|^cadastro$|^calendar$|^campaign$|^careers$|^cgi$|^client$|^cliente$|^code$|^comercial$|^compare$|^config$|^connect$|^contact$|^contest$|^create$|^code$|^compras$|^css$|^dashboard$|^data$|^db$|^design$|^delete$|^demo$|^design$|^designer$|^dev$|^devel$|^dir$|^directory$|^doc$|^docs$|^domain$|^download$|^downloads$|^edit$|^editor$|^email$|^ecommerce$|^forum$|^forums$|^faq$|^favorite$|^feed$|^feedback$|^flog$|^follow$|^file$|^files$|^free$|^ftp$|^gadget$|^gadgets$|^games$|^guest$|^group$|^groups$|^help$|^home$|^homepage$|^host$|^hosting$|^hostname$|^html$|^http$|^httpd$|^https$|^hpg$|^info$|^information$|^image$|^img$|^images$|^imap$|^index$|^invite$|^intranet$|^indice$|^ipad$|^iphone$|^irc$|^java$|^javascript$|^job$|^jobs$|^js$|^knowledgebase$|^log$|^login$|^logs$|^logout$|^list$|^lists$|^mail$|^mail1$|^mail2$|^mail3$|^mail4$|^mail5$|^mailer$|^mailing$|^mx$|^manager$|^marketing$|^master$|^me$|^media$|^message$|^microblog$|^microblogs$|^mine$|^mp3$|^msg$|^msn$|^mysql$|^messenger$|^mob$|^mobile$|^movie$|^movies$|^music$|^musicas$|^my$|^name$|^named$|^net$|^network$|^new$|^news$|^newsletter$|^nick$|^nickname$|^notes$|^noticias$|^ns$|^ns1$|^ns2$|^ns3$|^ns4$|^old$|^online$|^operator$|^order$|^orders$|^page$|^pager$|^pages$|^panel$|^password$|^perl$|^pic$|^pics$|^photo$|^photos$|^photoalbum$|^php$|^plugin$|^plugins$|^pop$|^pop3$|^post$|^postmaster$|^postfix$|^posts$|^profile$|^project$|^projects$|^promo$|^pub$|^public$|^python$|^random$|^register$|^registration$|^root$|^ruby$|^rss$|^sale$|^sales$|^sample$|^samples$|^script$|^scripts$|^secure$|^send$|^service$|^shop$|^sql$|^signup$|^signin$|^search$|^security$|^settings$|^setting$|^setup$|^site$|^sites$|^sitemap$|^smtp$|^soporte$|^ssh$|^stage$|^staging$|^start$|^subscribe$|^subdomain$|^suporte$|^support$|^stat$|^static$|^stats$|^status$|^store$|^stores$|^system$|^tablet$|^tablets$|^tech$|^telnet$|^test$|^test1$|^test2$|^test3$|^teste$|^tests$|^theme$|^themes$|^tmp$|^todo$|^task$|^tasks$|^tools$|^tv$|^talk$|^update$|^upload$|^url$|^user$|^username$|^usuario$|^usage$|^vendas$|^video$|^videos$|^visitor$|^win$|^ww$|^www$|^www1$|^www2$|^www3$|^www4$|^www5$|^www6$|^www7$|^wwww$|^wws$|^wwws$|^web$|^webmail$|^website$|^websites$|^webmaster$|^workshop$|^xxx$|^xpg$|^you$|^yourname$|^yourusername$|^yoursite$|^yourdomain$/);
				$scope.userdisable = false;
				if (userlen < 3 || savekeywords) {
					$scope.userdisable = true;
					if (userlen < 3){
						return "Username should have at least three characters";
					}
					if (savekeywords) {
						return "Username matches saved keywords, please use another name";
					}
				}
			},
			password : function() {
				var passwordlen = $scope.password.length;
				$scope.passworddisable = false;
				if (passwordlen < 4) {
					$scope.passworddisable = true;
					return "Password should have more than four characters";
				}
			}
		};

		/*
		$scope.login = function() {
			HomeService.login()
				.success(function (data, status, headers, config) {
					User.setUsername($scope.username);
					User.setPassword($scope.password);
					$location.path('/lobby');
				});
				//$location.path('/lobby');
		};
		*/

		$scope.login_or_signup = function() {
			var username = $scope.username;
			var password = $scope.password;
			$http.post('/users/login_or_signup', {
				"username": username,
				"password": password
			}).then(function(response) {
				// Take in the response information
				User.setUsername($scope.username);
				User.setPassword($scope.password);
				console.log(response.data);
				User.setLoginorSignup(response.data);
				$location.path('/lobby');
			}, function() {
				$scope.message="Login failed, please check your user name and password.";
			});
		};

	    socket.on("system_lock", function(req) {
	      // redirect client to maintenance page logic if test is ongoing
	      if (!req.systemAvailable){
	        console.log(req.message);
	        $location.path('/maintenance');
	      } 
	      else{
	        //client can access application now
	        console.log(req.message);
	      }
	    });
	});