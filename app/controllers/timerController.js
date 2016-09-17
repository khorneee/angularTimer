/**
 * Created by adminlocal on 17/09/2016.
 */
/**
 * Created by adminlocal on 11/09/2016.
 */
angular.module('angularTimer')
    .controller('timerController', function($scope, $interval, timerFactory) {

        $scope.loaded = false;
        $scope.counter = null;
        $scope.status = null;
        $scope.projectsRaw = null;
        $scope.projectsConverted = null;
        var _intervalId;

        $scope.proyects = null;
        $scope.workingProyect = null;

        $scope.workingProyect =
        {
            id: generateId(),
            task: 'Prueba3',
            proyect: 'Proyecto2',
            description: 'bla bla',
            seconds: 10,
            active: true,
            dateStart: "1473583660941"
        }

        $scope.logs = [];

        function init() {
            $scope.counter = "00:00:00";

            timerFactory.openDB();

            //cone a la escucha el $scope
            $scope.$watch('workingProyect.active',function () {
                if ($scope.workingProyect.active) {
                    _intervalId = $interval(updateTime, 1000);
                } else {
                    stopTime();
                }
            });

        }

        function updateTime() {

            var seconds = moment().diff(moment($scope.workingProyect.dateStart, 'x'), 'seconds');
            var elapsed = moment().startOf('day').seconds(seconds).format('HH:mm:ss');
            $scope.counter = elapsed;
        }

        function stopTime() {
            $interval.cancel(_intervalId);
            $scope.counter = "00:00:00";
        }

        $scope.startTracker = function () {

            $scope.workingProyect.active = true;
            $scope.workingProyect.dateStart = moment().format('x');
        };

        $scope.stopTracker = function () {
            stopTime();


            $scope.workingProyect.active = false;
            if (!!$scope.workingProyect.dateStart) {
                var seconds = moment().diff(moment($scope.workingProyect.dateStart, 'x'), 'seconds');
                $scope.workingProyect.seconds = seconds;
            }

            //a?adimos un id
            //$scope.workingProyect._id = $scope.proyects.length + 1;

            //dame la fehca de incio formateada y el time empleado formateado
            $scope.workingProyect.dateStartFormat = getDateStart($scope.workingProyect);
            $scope.workingProyect.timeSpend = getTime($scope.workingProyect);

            addarray($scope.workingProyect)
            $scope.workingProyect.id = generateId();

            console.log($scope.logs);
        };

        function getDateStart (proyect) {
            return moment(proyect.dateStart, "x").format("HH:mm:ss, DD-MM-YYYY");
        };

        function getTime(proyect) {
            return moment().startOf('day').seconds(proyect.seconds).format('HH:mm:ss');
        };

        function addarray(object){
            $scope.logs.unshift(object);
        }

        function generateId() {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return parseInt((Math.random() * 10000),10);
        };


        $scope.resumeTracker = function () {
            stopTime();
        };



        init();

    })