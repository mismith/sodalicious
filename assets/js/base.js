angular.module('sodalicious', ['firebaseHelper'])
	
	.run(function(){
		FastClick.attach(document.body);
	})
	
	.config(["$firebaseHelperProvider", function($firebaseHelperProvider){
		$firebaseHelperProvider.namespace('sodalicious');
	}])
		
	.controller('AppCtrl', ["$scope", "$firebaseHelper", "$timeout", function($scope, $firebaseHelper, $timeout){
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
	}])
	
	.directive('popper', function(){
		return function($scope, $element, $attrs){
			var rand = function(min, max){
				return (Math.random() * (max - min)) + min;
			};
			var i = $scope.$eval($attrs.popper);
			var popped = false;
			$scope.$watch('popped', function(v){
				if(v && ! popped){
					var transform = 'scale3d(1, 1, 1) translate3d(' + rand(-1000, 1000) + 'px, -200px, 50px) rotateX(-220deg) rotate(' + rand(-540, 270) + 'deg)';
					$element.css({
						transitionDelay: i * 30 + 'ms',
						webkitTransitionDelay: i * 30 + 'ms',
						transform: transform,
						webkitTransform: transform,
						opacity: 0,
					});
				}
			});
		};
	});