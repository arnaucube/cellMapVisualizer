'use strict';

angular.module('app.main', ['ngRoute', 'ui-leaflet'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'views/main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', function($scope, $http) {
    //map
    $scope.center = {};
    $scope.bounds = {};
    $scope.markers = [];
    $scope.paths = [];
    $scope.tiles = {
        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        options: {
            attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    };

    $http.get(urlapi + 'allcells')
        .then(function(data) {
            console.log('data success');
            console.log(data);
            $scope.cells = data.data;
            //draw markers on map
            $scope.markers = [];
            for (var i = 0; i < $scope.cells.length; i++) {
                $scope.markers.push({
                    lat: Number($scope.cells[i].lat),
                    lng: Number($scope.cells[i].lon),
                    message: $scope.cells[i].mcc
                });
                $scope.markers.push({
                    lat: Number($scope.cells[i].lat),
                    lng: Number($scope.cells[i].lon),
                    message: $scope.cells[i].mcc
                });
            }

            $scope.center = {
                lat: (Number($scope.cells[0].lat) + Number($scope.cells[0].lat)) / 2,
                lng: (Number($scope.cells[0].lon) + Number($scope.cells[0].lon)) / 2,
                zoom: 4
            };
        }, function(data) {
            console.log('data error');
        });
});
