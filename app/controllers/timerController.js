/**
 * Created by adminlocal on 17/09/2016.
 */
angular.module('angularTimer')
    .controller('timerController', function($scope, $interval, timerFactory, $timeout, $location) {

        $scope.loaded = false;
        $scope.counter = null;
        $scope.status = null;
        var _intervalId;

        $scope.projects = [];


        $scope.todo = {}
        $scope.todos = [];
        $scope.logs = [];

        function init() {
            $scope.counter = "00:00:00";

            //abrimos la bbdd
            timerFactory.openDB();

            //delay para abrir la base de datos
            $timeout(function(){

                 getStatus();//abrimos si hay status activo
                 getProjects();

                //cone a la escucha el $scope con un delay de un segundo para que carge
                $timeout(function(){
                $scope.$watch('workingProject.active',function () {

                    if (!!$scope.workingProject) {
                        if ($scope.workingProject.active) {
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
                getTodos() //abrimos todos


            },1000);


            $scope.loaded = true;

            $scope.navIsActive = function (path) {
                return path === $location.path();
            };

        }

        function updateTime() {

            var seconds = moment().diff(moment($scope.workingProject.dateStart, 'x'), 'seconds');
            var elapsed = moment().startOf('day').seconds(seconds).format('HH:mm:ss');

            $scope.counter = elapsed;
        }

        function stopTime() {
            $interval.cancel(_intervalId);
            $scope.counter = "00:00:00";

        }

        $scope.startTracker = function () {
            //si workingProject llega vacio no hay contadores a la espera
            if ($scope.workingProject == undefined){
                $scope.workingProject = { "active" : false ,
                                          "resume" :  false}
            }

            $scope.workingProject.active = true;
            $scope.workingProject.dateStart = getTimeNow();


            addStatus($scope.workingProject); //añadimos estatus
            getStatus(); //cogemos el id generado por la bbdd
        };

        $scope.stopTracker = function () {
            stopTime();


            $scope.workingProject.active = false;
            if (!!$scope.workingProject.dateStart) {
                var seconds = moment().diff(moment($scope.workingProject.dateStart, 'x'), 'seconds');
                $scope.workingProject.seconds = seconds;
            }

            $scope.workingProject.dateEnd = getTimeNow();
            //dame la fehca de incio formateada y el time empleado formateado
            $scope.workingProject.dateStartFormat = getDateStart($scope.workingProject);
            $scope.workingProject.timeSpend = getTime($scope.workingProject);



            //añadimos log
            addlog($scope.workingProject);
            //refresamos logas
            getLogs();
            //borramos status
            deleteStatus($scope.workingProject.id)

            //limpiamos el working projec
            $scope.workingProject = null;



        };


        $scope.resumeTracker = function (id) {
            //si hay alguno correndo lo para
            if($scope.workingProject != undefined){
                $scope.stopTracker();
            }
            getLog(id);

            $timeout(function(){
                $scope.workingProject.active = true;
                $scope.workingProject.resume = true;
                //$scope.workingProject.dateStart = getTimeNow();
                addStatus($scope.workingProject);
                $scope.deleteLog($scope.workingProject.id);
            },1000)



        };



        function getDateStart (project) {
            return moment(project.dateStart, "x").format("HH:mm:ss, DD-MM-YYYY");
        };

        function getTime(project) {
            return moment().startOf('day').seconds(project.seconds).format('HH:mm:ss');
        };

        function getTimeNow(){
            return moment().format("x");
        }


        //LOGS
        function addlog (log) {
            timerFactory.addLog(log).then(function () {
            }, function (err) {
                alert(err);
            });
        }

        function getLogs(){
            timerFactory.getLogs().then(function (data) {
                $scope.logs = data; //no hay manera mas elegante
            }, function (err) {
                alert(err);
            });
        };

        $scope.deleteLog = function(id){
            timerFactory.deleteLog(id).then(function () {
                console.log('log elimiando')
                getLogs();
            }, function (err) {
                alert(err);
            });

        }

        function getLog(id){
            timerFactory.getLog(id).then(function (data) {
                $scope.workingProject = data; //no hya manera mas elegante
                console.log('Log por id')
                console.log($scope.workingProject)
            }, function (err) {
                alert(err);
            });
        };

        //STATUS
        function getStatus(){
            timerFactory.getStatus().then(function (data) {
                var postData = data[0] //devuelve un array cojemos la posicion 0
                $scope.workingProject = postData; //no hay manera mas elegante
                console.log($scope.workingProject)
            }, function (err) {
                alert(err);
            });
        };

        function addStatus (status) {
            timerFactory.addStatus(status).then(function () {
                console.log('Status añadido');
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

        //TODOS
        function getTodos(){
            timerFactory.getTodos().then(function (data) {
                $scope.todos = data; //no hay manera mas elegante
            }, function (err) {
                alert(err);
            });
        }

        $scope.addTodo = function(todo){
            //$scope.todo.id = generateId();
            timerFactory.addTodo(todo).then(function () {
                console.log('Todo añadido');
                getTodos()
                $scope.todo = null; //limpiamos el todo
            }, function (err) {
                alert(err);
            });
        }

        $scope.deleteTodo = function(id){
            timerFactory.deleteTodo(id).then(function () {
                console.log('todo elimiando')
                getTodos()
            }, function (err) {
                alert(err);
            });
        }

        //PROJECT
        $scope.addProject = function(project){
            //$scope.todo.id = generateId();
            timerFactory.addProject(project).then(function () {
                console.log('projeco añadido');
                getProjects()
                $scope.newProjectName = null;
            }, function (err) {
                alert(err);
            });
        }

        function getProjects(){
            timerFactory.getProjects().then(function (data) {
                $scope.projects = data; //no hay manera mas elegante
            }, function (err) {
                alert(err);
            });
        }

        $scope.deleteProject = function(id){
            if($scope.logs.length > 0){
                //si no hay ningun log no borrar en cascada solo borrar el proyecto
                for (var i = 0, len = $scope.logs.length; i < len; i++) {
                    if ($scope.logs[i].project.id == id) {
                        console.log($scope.logs[i].project.id)
                        timerFactory.deleteLog($scope.logs[i].id).then(function () {
                            console.log('log elimiando')

                        }, function (err) {
                            alert(err);
                        });
                    }
                }
            }
            timerFactory.deleteProject(id).then(function () {
                console.log('projeco elimiando')
                getProjects();
                getLogs()
            }, function (err) {
                alert(err);
            });
        }

        $scope.getTimeSpendPerProject = function(id){
            var seconds = 0;
            for (var i = 0, len = $scope.logs.length; i < len; i++) {
                if ($scope.logs[i].project.id == id) {
                    seconds += $scope.logs[i].seconds;
                }
            }
            var timeSpent = moment().startOf('day').seconds(seconds).format('HH:mm:ss');
            return timeSpent;
        }


        init();

    })