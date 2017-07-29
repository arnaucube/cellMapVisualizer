'use strict';

var urlapi = "http://127.0.0.1:3017/";

// Declare app level module which depends on views, and components
angular.module('webApp', [
    'ngRoute',
    'ngMessages',
    'angularBootstrapMaterial',
    'app.navbar',
    'app.main'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({
            redirectTo: '/main'
        });
    }]);
