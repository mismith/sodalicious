angular.module('sodalicious', ['firebaseHelper'])
	
	.run(function(){
		FastClick.attach(document.body);
	})
	
	.config(["$firebaseHelperProvider", function($firebaseHelperProvider){
		$firebaseHelperProvider.namespace('sodalicious');
	}])
		
	.controller('AppCtrl', ["$scope", "$firebaseHelper", "$timeout", function($scope, $firebaseHelper, $timeout){
/*
		$scope.randp = function(min, max){
			return Math.random() * max + min + '%';
		};
*/
		
		
		var now = function(){ return new Date; };
		var startTime = +now();
		$scope.startTimer = function(){
			startTime = +now();
		};
		
		var clicks = $firebaseHelper.array('clicks');
		var loaded = $firebaseHelper.object('count').$bindTo($scope, 'count');
		$scope.pop = function(){
			loaded.then(function(){
				$scope.popped = true;
				$scope.count.$value = ($scope.count.$value || 0) + 1;
				clicks.$add({
					timestamp: now().toString(),
					waited: Math.round((+now() - startTime) / 1000),
					useragent: navigator.userAgent,
				});
				
				$timeout(function(){
					$scope.poppedDone= true;
				}, 600);
			});
		};
		
		$scope.friendlyCount = function(count){
			if(count < 1000) return count;
			else if(count < 1000000) return Math.floor(count / 100) / 10 + 'K';
			else if (count < 1000000000) return Math.floor(count / 100000) / 10 + 'M';
			
			return count;
		};
	}]);