'use strict';

angular.module('app.main', ['ngRoute', 'leaflet-directive'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'views/main/main.html',
            controller: 'MainCtrl'
        });
    }])

    .controller('MainCtrl', function($scope, $http, leafletMapEvents) {
        //get mcc and mnc data
        $scope.mcc=[];
        $http.get('mcc-mnc-list.json')
            .then(function(data) {
                console.log('data success');
                console.log(data);
                $scope.mcc = data.data;
            }, function(data) {
                console.log('data error');
            });



        //map
        $scope.center = {
            lat: 41.38014146592283,
            lng: 2.1773743629455566,
            zoom: 17
        };
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
        $scope.events = {
            map: {
                enable: ['dragend'],
                logic: 'emit'
            }
        };
        $scope.eventDetected = "No events yet...";
        console.log($scope.eventDetected);
        $scope.$on('leafletDirectiveMap.map-simple-map.dragend', function(event) {
            $scope.eventDetected = "Dragend";
            console.log($scope.eventDetected);
            console.log($scope.center);
            if ($scope.center.zoom > 16) {
                $scope.getCells($scope.center.lat, $scope.center.lng);
            }
        });

        var antennaIcon = {
            iconUrl: 'img/antenna.png',
            iconSize: [50, 50], // size of the icon
            iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        };
        var markX = {
            iconUrl: 'img/markX.png',
            iconSize: [50, 50], // size of the icon
            iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        };
        var markY = {
            iconUrl: 'img/markY.png',
            iconSize: [50, 50], // size of the icon
            iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        };
        $scope.getCells = function(lat, lng) {
            $scope.status = "getting data";
            var xLat = lat + 0.002;
            var xLng = lng - 0.004;
            var yLat = lat - 0.002;
            var yLng = lng + 0.004;
            console.log(xLat + ", " + xLng);
            console.log(yLat + ", " + yLng);
            //$http.get(urlapi + 'cells/43.73429/7.41841/43.73210/7.42196')
            $http.get(urlapi + 'cells/' + xLat + '/' + xLng + '/' + yLat + '/' + yLng)
                .then(function(data) {
                    console.log('data success');
                    console.log(data);
                    $scope.cells = data.data;
                    //draw markers on map
                    $scope.markers = [];
                    $scope.markers.push({
                        lat: Number(xLat),
                        lng: Number(xLng),
                        icon: markX
                    });
                    $scope.markers.push({
                        lat: Number(yLat),
                        lng: Number(yLng),
                        icon: markY
                    });
                    for (var i = 0; i < $scope.cells.length; i++) {
                        /*var company ="";
                        company = $scope.mcc.filter(function(obj){
                            return obj.mcc==$scope.cells[i].mcc && obj.mnc == $scope.cells[i].net;
                        });*/
                        var company = "";
                        for(var k in $scope.mcc){
                            if($scope.mcc[k].mcc==$scope.cells[i].mcc && $scope.mcc[k].mnc == $scope.cells[i].net) {
                                company = $scope.mcc[k];
                            }
                        }
                        console.log(company);
                        $scope.markers.push({
                            lat: Number($scope.cells[i].lat),
                            lng: Number($scope.cells[i].lon),
                            message: "lat:" + $scope.cells[i].lat + ", lon:" + $scope.cells[i].lon +"<br> mcc:"+ $scope.cells[i].mcc + ", mnc:" + $scope.cells[i].net + "<br>" + company.brand,
                            icon: antennaIcon
                        });
                    }

                    /*$scope.center = {
                        lat: (Number($scope.cells[0].lat) + Number($scope.cells[0].lat)) / 2,
                        lng: (Number($scope.cells[0].lon) + Number($scope.cells[0].lon)) / 2,
                        zoom: 16
                    };*/
                    $scope.status = "data charged";
                }, function(data) {
                    console.log('data error');
                });
        };
        $scope.getCells(41.38014146592283, 2.1773743629455566);
        $scope.status = "getting data";
    });
