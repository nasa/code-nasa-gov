'use strict';
angular.module('code', ['MyAwesomePartials','ngRoute']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {templateUrl: 'partials/main.html',   controller: CodeCtrl}).
  when('/guide', {templateUrl: 'partials/guide.html', controller: GuideCtrl}).
  when('/SRA', {templateUrl: 'partials/guide.html', controller: GuideCtrl}).
  when('/share', {templateUrl: 'partials/share.html'}).
  otherwise({redirectTo: '/'});
}]
);