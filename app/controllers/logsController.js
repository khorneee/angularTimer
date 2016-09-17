angular.module('angularTimer')
    .controller('LogsController', function($scope, $interval, timerFactory, $timeout, $location) {

        $scope.loaded = true

        console.log('Vista log cargada');
    })