/**
 * Created by adminlocal on 17/09/2016.
 */
angular.module('angularTimer')
    .controller('timerController', function($scope, $interval, timerFactory,$timeout) {

        $scope.loaded = false;
        $scope.counter = null;
        $scope.status = null;
        var _intervalId;

        $scope.proyects = null;


        $scope.logs = [];

        function init() {
            $scope.counter = "00:00:00";

            //abrimos la bbdd
            timerFactory.openDB();

            //delay para abrir la base de datos
            $timeout(function(){
                /*$timeout(function(){
                    getStatus()
                },1000)*/

                 getStatus();//abrimos si hay status activo


                //cone a la escucha el $scope con un delay de un segundoo para que carge
                $timeout(function(){
                $scope.$watch('workingProyect.active',function () {

                    if (!!$scope.workingProyect) {
                        if ($scope.workingProyect.active) {
                            _intervalId = $interval(updateTime, 1000);
                        } else {
                            stopTime();
                        }
                    } else {
                        stopTime();
                    }

                });
                },1000)

                getLogs(); //abrimos logs
            },1000);





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
            //si workingProyect llega vacio no hay contadores a la espera
            if ($scope.workingProyect == undefined){
                $scope.workingProyect = { "active" : false}
            }

            $scope.workingProyect.active = true;
            $scope.workingProyect.dateStart = moment().format('x');
            console.log($scope.workingProyect)

            $scope.workingProyect.id = generateId()
            addStatus($scope.workingProyect);

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

            //a�adimos log
            addlog($scope.workingProyect);
            getLogs();
            deleteStatus($scope.workingProyect.id)

            $scope.workingProyect.id = generateId();

            console.log($scope.logs);

        };

        function getDateStart (proyect) {
            return moment(proyect.dateStart, "x").format("HH:mm:ss, DD-MM-YYYY");
        };

        function getTime(proyect) {
            return moment().startOf('day').seconds(proyect.seconds).format('HH:mm:ss');
        };

        function generateId() {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return parseInt((Math.random() * 10000),10);
        };

        function addlog (log) {
            timerFactory.addLog(log).then(function () {
                console.log('Log a�adido');
            }, function (err) {
                alert(err);
            });
        }

        function getLogs(){
            timerFactory.getLogs().then(function (data) {
                $scope.logs = data; //no hya manera mas elegante
                console.log(data)
            }, function (err) {
                alert(err);
            });
        };

        function getStatus(){
            timerFactory.getStatus().then(function (data) {
                var postData = data[0] //devuelve un array cojemos la posicion 0
                $scope.workingProyect = postData; //no hya manera mas elegante
                console.log($scope.workingProyect)
            }, function (err) {
                alert(err);
            });
        };

        function addStatus (status) {
            timerFactory.addStatus(status).then(function () {
                console.log('Status a�adido');
            }, function (err) {
                alert(err);
            });
        }

        function deleteStatus (id){
            timerFactory.deleteStatus(id).then(function () {
                console.log('Status elimiando')
            }, function (err) {
                alert(err);
            });

        }




        $scope.resumeTracker = function () {
            stopTime();
        };


        init();

    })