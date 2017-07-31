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
        //url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        // més estils https://leaflet-extras.github.io/leaflet-providers/preview/
        options: {
            attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    };
    //var antennaIcon = L.icon({
    var antennaIcon = {
        iconUrl: 'img/antenna.png',
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
    };

    $http.get(urlapi + 'cells/43.73429/7.41841/43.73210/7.42196')
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
                    message: $scope.cells[i].mcc,
                    icon: antennaIcon
                });
            }

            $scope.center = {
                lat: (Number($scope.cells[0].lat) + Number($scope.cells[0].lat)) / 2,
                lng: (Number($scope.cells[0].lon) + Number($scope.cells[0].lon)) / 2,
                zoom: 16
            };
        }, function(data) {
            console.log('data error');
        });
});
