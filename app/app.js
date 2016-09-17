/**
 * Created by adminlocal on 17/09/2016.
 */
angular.module('angularTimer', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'LogsController',
                templateUrl: 'app/views/logs.html'
            })
            .when('/projects', {
                controller: 'ProjectsController',
                templateUrl: 'app/views/projects.html'
            })
            .when('/projects/:projectId', {
                controller: 'CourseViewController',
                templateUrl: 'app/views/projectItem.html'
            })
            .when('/statistics', {
                controller: 'StatisticsController',
                templateUrl: 'app/views/statistics.html'
            })
            .when('/statistics/:projectId', {
                controller: 'StatisticsController',
                templateUrl: 'app/views/statistics.html'
            })
            .when('/todo', {
                controller: 'todoController',
                templateUrl: 'app/views/todo.html'
            })
            .otherwise({ redirectTo: '/' });
    });