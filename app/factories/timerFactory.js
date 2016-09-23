/**
 * Created by adminlocal on 17/09/2016.
 */
angular.module('angularTimer').factory('timerFactory', function ($window, $q) {
    var indexedDB = $window.indexedDB;
    var db = null;
    var lastIndex = 0;
    //indexedDB.deleteDatabase("timerDB");

    var openDB = function () {
        var deferred = $q.defer();
        var version = 2;
        var request = indexedDB.open("timerDB", version);

        request.onupgradeneeded = function (e) {
            db = e.target.result;

            e.target.transaction.onerror = indexedDB.onerror;

            if (db.objectStoreNames.contains("logs")) {
                db.deleteObjectStore("logs");
            }

            var logsStore = db.createObjectStore("logs", {
                keyPath: "id",
                autoIncrement:true
            });

            var todoStore = db.createObjectStore("todo", {
                keyPath: "id",
                autoIncrement:true
            });

            var statusStore = db.createObjectStore("status", {
                keyPath: "id",
                autoIncrement:true
            });

            var statusStore = db.createObjectStore("project", {
                keyPath: "id",
                autoIncrement:true
            });
        };

        request.onsuccess = function (e) {
            db = e.target.result;
            deferred.resolve();
        };

        request.onerror = function () {
            deferred.reject();
        };

        return deferred.promise;
    };

    var getLogs = function () {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["logs"], "readwrite");
            var store = trans.objectStore("logs");
            var logs = [];

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.resolve(logs);
                } else {
                    logs.unshift(result.value);
                    if (result.value.id > lastIndex) {
                        lastIndex = result.value.id;
                    }
                    result.
                        continue ();
                }
            };

            cursorRequest.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };

    var getLog = function (id) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["logs"], "readwrite");
            var store = trans.objectStore("logs");
            var log = {};
            var request = store.get(id)


            request.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.reject('Not found!!');
                } else {
                    deferred.resolve(result);
                }
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };


    var deleteLog = function (id) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["logs"], "readwrite");
            var store = trans.objectStore("logs");

            var request = store.delete(id);

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Todo item couldn't be deleted");
            };
        }

        return deferred.promise;
    };

    var addLog = function (log) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["logs"], "readwrite");
            var store = trans.objectStore("logs");
            lastIndex++;
            var request = store.put({
                "active": log.active,
                "dateStart": log.dateStart,
                "dateEnd": log.dateEnd,
                "dateStartFormat": log.dateStartFormat,
                "description": log.description,
                "project" : log.project,
                "task" : log.task,
                "notes" : log.notes,
                "timeSpend" : log.timeSpend,
                "seconds" : log.seconds,
            });

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Todo item couldn't be added!");
            };
        }
        return deferred.promise;
    };

    var addStatus = function (status) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["status"], "readwrite");
            var store = trans.objectStore("status");
            lastIndex++;
            var request = store.put({
                "dateStart": status.dateStart,
                "active": status.active,
                "resume": status.resume,
                "description": status.description,
                "project" : status.project,
                "task" : status.task,
                "notes" : status.notes,
            });

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Todo item couldn't be added!");
            };
        }
        return deferred.promise;
    };

    var getStatus = function () {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["status"], "readwrite");
            var store = trans.objectStore("status");
            var logs = [];

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.resolve(logs);
                } else {
                    logs.unshift(result.value);
                    if (result.value.id > lastIndex) {
                        lastIndex = result.value.id;
                    }
                    result.
                        continue ();
                }
            };

            cursorRequest.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };

    var deleteStatus = function (id) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["status"], "readwrite");
            var store = trans.objectStore("status");

            var request = store.delete(id);

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Todo item couldn't be deleted");
            };
        }

        return deferred.promise;
    };

    var getTodos = function () {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["todo"], "readwrite");
            var store = trans.objectStore("todo");
            var todos = [];

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.resolve(todos);
                } else {
                    todos.unshift(result.value);
                    if (result.value.id > lastIndex) {
                        lastIndex = result.value.id;
                    }
                    result.
                        continue ();
                }
            };

            cursorRequest.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };

    var addTodo = function (todo) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["todo"], "readwrite");
            var store = trans.objectStore("todo");
            lastIndex++;
            var request = store.put({
                "description" : todo.description

            });

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Todo item couldn't be added!");
            };
        }
        return deferred.promise;
    };

    var deleteTodo = function (id) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["todo"], "readwrite");
            var store = trans.objectStore("todo");

            var request = store.delete(id);

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Todo item couldn't be deleted");
            };
        }

        return deferred.promise;
    };

    var getProjects = function () {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["project"], "readwrite");
            var store = trans.objectStore("project");
            var projects = [];

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.resolve(projects);
                } else {
                    projects.unshift(result.value);
                    if (result.value.id > lastIndex) {
                        lastIndex = result.value.id;
                    }
                    result.
                        continue ();
                }
            };

            cursorRequest.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };

    var addProject = function (projectName) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["project"], "readwrite");
            var store = trans.objectStore("project");
            lastIndex++;
            var request = store.put({
                "name" : projectName //

            });

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("project item couldn't be added!");
            };
        }
        return deferred.promise;
    };

    var deleteProject = function (id) {
        var deferred = $q.defer();
        console.log(id);
        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["project"], "readwrite");
            var store = trans.objectStore("project");

            var request = store.delete(id);

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("project item couldn't be deleted");
            };
        }

        return deferred.promise;
    };

    return {
        openDB: openDB,
        getLogs: getLogs,
        addLog: addLog,
        deleteLog: deleteLog,
        addStatus: addStatus,
        getStatus: getStatus,
        deleteStatus : deleteStatus,
        getLog: getLog,
        getTodos : getTodos,
        addTodo : addTodo,
        deleteTodo : deleteTodo,
        getProjects : getProjects,
        addProject : addProject,
        deleteProject : deleteProject
    };

});