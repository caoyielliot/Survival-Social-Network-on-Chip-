angular.module('SSNoC')

    .controller('searchResultController', function ($scope, $location, $http, search, socket) {

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
        
        $scope.keywords = '';

        $scope.validation = {
            keywords: function () {
                var keywords = $scope.keywords;
                var keywordsl = $scope.keywords.length;
                if (keywordsl == 0) {
                    return "Please input keywords";
                } else {
                    var words = filterkeywords(keywords);
                    // console.log("here is the words lenghth");
                    if (words.length === 0) {
                        return "All the words are stopwords, please try others";
                    }
                }

            }
        }

        $scope.count={
            generalcounter: function(x,y) {
                
                if ((typeof $scope.messages)=='undefined'||(typeof $scope.showedusers)=='undefined') {
                    // the variables haven't been defined
                    return -1;
                }
                // the variables now are all objects
                if ($scope.messages.length == 0 && $scope.showedusers.length == 0 ) {
                    // when we do not have any return values
                    return 0;
                }
                else if ($scope.messages.length == 0 && $scope.showedusers.length !== 0) {
                    // searching users
                    if ($scope.showedusers.length > x*y) {
                        // the length is longer than the number that is able to show
                        return x*y;
                    } else {
                        return $scope.showedusers.length;
                    }
                }
                else if ($scope.messages.length !== 0 && $scope.showedusers.length == 0){
                    // searching messages
                    if ($scope.messages.length > x*y) {
                        return x*y;
                    } else {
                        return $scope.messages.length;
                    }

                }
                else {
                    // There are errors
                    return -1;
                }
            }
        }
        


        // write a function to filter the null
        function filternull(word) {
            return word !== null;
        }

        // Then write a function to filter the stopwords
        function filterkeywords(input) {

            var words = input.split(/[^0-9A-Za-z]+/);
            console.log(words);
            var stopWords = "a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your";

            // filter out the stopwords
            for (var i = 0; i < words.length; i++) {
                // case insensitive
                if (stopWords.match(".*\\b" + words[i].toLowerCase() + "\\b.*")) {
                    console.log(words[i]);
                    words[i] = null;
                }
            }

            words = words.filter(filternull);
            console.log(words.length);
            return words;
        }
        // write a function for sorting the users
        function compareusers(usera, userb) {
            if (usera.USERONLINE < userb.USERONLINE) {
                return 1;
            }
            else if(usera.USERONLINE > userb.USERONLINE) {
                return -1;
            }
            else {
                if (usera.USERNAME < userb.USERNAME) {
                    return -1;
                }
                else if (usera.USERNAME > userb.USERNAME){
                    return 1;
                }
                else 
                    return 0;
            }
        }

        $scope.sections = [{
            name: 'Users by Username'
        }, {
            name: 'Users by Status'
        }, {
            name: 'Announcements'
        }, {
            name: 'Public Messages'
        }, {
            name: 'Private Messages'
        }];
        $scope.isSelected = function (section) {

            return $scope.selected === section;
        };

        $scope.setSelected = function (section) {
            $scope.selected = section;
        };

        $scope.setMaster = function () {
            $scope.y=1;
            var section = $scope.selected;
            var target = section.name;
            var keywords = $scope.keywords;
            // split the keywords by spaces
            var words = filterkeywords(keywords);

            $("#search_result").show();

            $scope.errors = 1;
            // empty the results for new searches
            $scope.showedusers = [];
            $scope.messages = [];
            // Search usernames
            if (target.indexOf('Users by Username') >= 0) {
                var usernames = [];
                var pickedusernames = [];
                $http.get('/users').then(function (response) {

                    // console.log(response.data);
                    usernames = response.data;

                    for (var i = 0; i < usernames.length; i++) {
                        var content = usernames[i];
                        for (var j = 0; j < words.length; j++) {
                            // console.log(content.NAME);
                            if (content.NAME.toLowerCase().indexOf(words[j].toLowerCase()) >= 0) {
                                // console.log("matched:"+content.NAME);
                                var result = {
                                    USERNAME: content.NAME,
                                    USERONLINE: "Checking online...",
                                    STATUS: content.STATUS
                                };

                                // console.log(result);
                                pickedusernames.push(result);
                                
                            }
                        }

                    }
                    // try to get the online information
                    socket.emit('check_all_online', pickedusernames);
                    for (var eachline in pickedusernames) {
                        console.log("web part emitted:" + pickedusernames[eachline]);
                    }
                    socket.on('check_all_online', function (user) {
                        // console.log("socket :\n"+user);
                        for (var eachuser in user) {
                            console.log("web part: " + user[eachuser]);
                        }
                        $scope.showedusers = user.sort(compareusers);
                    });

                });

            }
            // Search given status
            if (target.indexOf('Users by Status') >= 0) {
                var usernames = [];
                var pickedusernames = [];
                $http.get('/users').then(function (response) {

                    console.log(response.data);
                    usernames = response.data;

                    for (var i = 0; i < usernames.length; i++) {
                        var content = usernames[i];
                        for (var j = 0; j < words.length; j++) {
                            console.log(content.STATUS);
                            if (content.STATUS.toLowerCase().indexOf(words[j].toLowerCase()) >= 0) {
                                // console.log("macthed:");
                                console.log("matched:" + content.NAME);
                                var result = {
                                    USERNAME: content.NAME,
                                    USERONLINE: "Checking online...",
                                    STATUS: content.STATUS
                                };
                                pickedusernames.push(result);

                                
                            }
                        }

                    }
                    // try to get the online information
                    socket.emit('check_all_online', pickedusernames);
                    for (var eachline in pickedusernames) {
                        console.log("web part emitted:" + pickedusernames[eachline]);
                    }
                    socket.on('check_all_online', function (user) {
                        // console.log("socket :\n"+user);
                        for (var eachuser in user) {
                            console.log("web part: " + user[eachuser]);
                        }
                        $scope.showedusers = user.sort(compareusers);
                    });
                });
            }
            // Search public message
            if (target.indexOf('Public Messages') >= 0) {
                var msgs = [];
                var publicMsgs = [];
                $http.get('/messages/public/' + target).then(function (response) {

                    publicMsgs = response.data;
                    for (var i = 0; i < publicMsgs.length; i++) {
                        var content = publicMsgs[i];
                        for (var j = 0; j < words.length; j++) {
                            if (content.MESSAGE.toLowerCase().indexOf(words[j].toLowerCase()) >= 0) {

                                msgs.push(content);
                                
                            }
                        }
                        $scope.messages = msgs;
                    }
                });
            }
            // search private message
            if (target.indexOf('Private Messages') >= 0) {
                var msgs = [];
                var privateMsgs = [];
                $http.get('/messages/private').then(function (response) {

                    privateMsgs = response.data;
                    for (var i = 0; i < privateMsgs.length; i++) {
                        var content = privateMsgs[i];
                        for (var j = 0; j < words.length; j++) {
                            if (content.MESSAGE.toLowerCase().indexOf(words[j].toLowerCase()) >= 0) {
                                msgs.push(content);
                                
                            }
                        }
                    }
                    $scope.messages = msgs;


                });
            }
            // search announcement
            if (target.indexOf('Announcements') >= 0) {
                var msgs = [];
                var announcements = [];
                $http.get('/announcements').then(function (response) {
                    announcements = response.data;
                    for (var i = 0; i < announcements.length; i++) {
                        var content = announcements[i];
                        for (var j = 0; j < words.length; j++) {
                            if (content.ANNOUNCEMENT.toLowerCase().indexOf(words[j].toLowerCase()) >= 0) {
                                msgs.push(content);
                                
                            }
                        }
                    }
                    $scope.messages = msgs;
                });
            }
        }
    });