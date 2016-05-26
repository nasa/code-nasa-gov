'use strict';
angular.module('code', [/*'ngAnimate',*/'ngRoute' /*, 'codeDirectives', 'pretty-checkable'*/]).
  config(['$routeProvider', function($routeProvider) {
  	$routeProvider.
  		when('/', {templateUrl: 'partials/main.html',   controller: CodeCtrl}).
  		when('/guide', {templateUrl: 'partials/guide.html', controller: GuideCtrl}).
	    when('/SRA', {templateUrl: 'partials/guide.html', controller: GuideCtrl}).
  		when('/share', {templateUrl: 'partials/share.html'}).
//  		when('/:name', {
//  			templateUrl: function(urlattr) {
//                return 'partials/details.html';
//            },controller: 'DetailCtrl'
//        }).
  		otherwise({redirectTo: '/'});
}]
//  , ['prettyCheckableConfig',function(prettyCheckableConfig){
//	  console.log("config");
//}]
  );

