/**
 * Created by Eren on 3/22/16.
 */
angular.module('SSNoC')
  .controller('measurePerformanceController', function ($scope, $state, $location, User, socket, $http) {

    var monitorUser = User.getUsername();
    var nonTestMode = true; //to determine state of End Test button
    var postMsgCounter = 0;
    var postLimitCounter = 0;
    var getMsgCounter = 0;
    var performanceTimer = 0;
    var startPostTime;
    var postDuration;
    var getDuration;
    var postTimer;
    var getTimer;
    var timeOutId;
    var terminated = false; //to determine if user ended test session


    /**
	 * Helper functions.
	 */
    function displayTestResults(){
		var element = angular.element(document.querySelector('#resultsDisplay'));
		var postReqPerSec = postMsgCounter/postDuration;
		var getReqPerSec = getMsgCounter/getDuration;

		element.append("<hr><br><div class='row'>"+
			"<h4>Performance Testing Results</h4>"+
			"<p>Post Requests Per Second:  <b>" + postReqPerSec + "</b></p>"+
			"<p>Get Requests Per Second:  <b>" + getReqPerSec + "</b></p>"+
			"</div>");
	}

	function getMessages() {
	 	$http.get('/messages/public/'+User.getUsername()).then(function (response) {
      		$scope.messages = response.data;
			getMsgCounter = getMsgCounter + 1;
			console.log("Get message count: "+getMsgCounter);
    	});
	}

	function initGet(interval){
		var startGetTime = new Date();
		console.log("HTTP GET starting at: "+startGetTime);

		getTimer = setInterval(function() { 
				processGet(startGetTime, getDuration, getTimer);
			} , interval);
	}

	function moreTimeToTest(beginTime, durationEntered) {
		var startTimeInMS = beginTime.getTime();
		var timeTrackerInMS = new Date().getTime();
		var diffSeconds = Math.ceil((timeTrackerInMS - startTimeInMS) / 1000);

		if (diffSeconds > durationEntered) {
			return false;
		}
		else{
			return true;
		}
	}

	function postMessage() {

		var postMsgID = postMsgCounter + 1;
		var testMessage = "This is test message " + postMsgID + " from "+monitorUser;
		var timeStamp= new Date();
		$http.post('/messages/public/'+User.getUsername(), {
			"username": User.getUsername(),
			"message": testMessage,
			"timestamp": timeStamp
		}, function() {
			console.log("Error posting message to database");
		});

		postMsgCounter = postMsgCounter + 1;
		postLimitCounter = postLimitCounter + 1;

		if (postLimitCounter > 1000){
			console.log("Post Request limit exceeded");
			
			//Delete all messages from database
			refreshDatabase();

			//Reset counter
			postLimitCounter = 1;
		}
		console.log("Post message count: "+postMsgCounter);

	}

	function processGet(startGetTime, getDuration, getTimer){
		socket.emit("test_mode", {
			tester: monitorUser,
			testInProgress: true
		});
		if (moreTimeToTest(startGetTime, getDuration)) {
			getMessages();
		}
		else{
			clearInterval(getTimer);
			console.log("Testing ended!");
			nonTestMode = true;
			
			console.log($scope.testStarted());

			//Display Results
			displayTestResults();
			terminated = true;
			console.log("Number of post messages "+postMsgCounter);
			console.log("Number of get messages "+getMsgCounter);

			//Emit message to server that test has ended
			socket.emit("test_mode", {
				tester: monitorUser,
				testInProgress: false
			});

			//Disable End Test button
			var button = angular.element(document.querySelector('#endButton'));
			button.attr("disabled", "disabled");
		}
	}

	function processPost(startPostTime, postDuration, postTimer){
		socket.emit("test_mode", {
			tester: monitorUser,
			testInProgress: true
		});
		if (moreTimeToTest(startPostTime, postDuration)) {
			postMessage();
		}
		else{
			clearInterval(postTimer);
		}
	}

	function refreshDatabase(){
		console.log("Initiating call to refresh database....");

	 	$http.delete('/messages/public/'+User.getUsername()).then(function (response) {
			console.log("Messages deleted from database");
    	});
	}

	/**
	 * Scope functions
	 */

	$scope.validation = {
		duration: function() {
			var duration = $scope.duration;
			$scope.durationdisable = false;

			if ((duration === undefined) || (duration === null)) {
				$scope.durationdisable = true;
				return "Enter duration time in digits";
			}
			else { 
				$scope.durationdisable = false;
			}
		}, 

		interval: function() {
			var interval = $scope.interval;
			$scope.intervaldisable = false;

			if ((interval === undefined) || (interval === null)) {
				$scope.intervaldisable = true;
				return "Enter interval parameters in digits";
			}
			else { 
				$scope.intervaldisable = false;
			}
		}

	};

	$scope.testStarted = function(e){
		return nonTestMode;
	}


    $scope.startMeasure = function(){
    	nonTestMode = false;	//test mode activated
    	terminated = false;		//Monitor did not terminate

    	//Reset all counters
    	postMsgCounter = 0;
    	getMsgCounter = 0;

    	startPostTime = new Date();
    	console.log("HTTP POST starting at: "+startPostTime);

		var duration = $scope.duration;
		var interval = $scope.interval;
		console.log("This is the duration " +duration*1000+"ms");
		console.log("This is the interval " +interval+"ms");

		$scope.duration = '';
    	$scope.interval = '';

		//Splitting the duration between post and get requests
		postDuration = duration / 2;
		getDuration = duration / 2;
		console.log("This is the post duration " +postDuration*1000+"ms");
		console.log("This is the get duration " +getDuration*1000+"ms");

		if (!nonTestMode){
			socket.emit("test_mode", {
				tester: monitorUser,
				testInProgress: true
			});

			timeOutId = setTimeout(function() {
				initGet(interval);
			}, postDuration*1000);

			postTimer = setInterval(function() { 
				processPost(startPostTime, postDuration, postTimer);
			} , interval);

		}
	}

	$scope.stopMeasure = function(){
		//Clear all timers
		clearInterval(getTimer);
		clearInterval(postTimer);
		clearTimeout(timeOutId);

		//Display results
		if (!terminated){
			displayTestResults();
		}
		
		//Disable End Test Button
		nonTestMode = true;

		//Emit message to server that test has ended
		socket.emit("test_mode", {
			tester: monitorUser,
			testInProgress: false
		});

	}

  });
