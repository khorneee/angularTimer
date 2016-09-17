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
                keyPath: "id"
            });

            var todoStore = db.createObjectStore("todo", {
                keyPath: "id"
            });

            var statusStore = db.createObjectStore("status", {
                keyPath: "id"
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
                "id": log.id,
                "active": log.active,
                "dateStart": log.dateStart,
                "dateStartFormat": log.dateStartFormat,
                "description": log.description,
                "proyect" : log.proyect,
                "task" : log.task,
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
                "id": status.id,
                "dateStart": status.dateStart,
                "active": status.active
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


    return {
        openDB: openDB,
        getLogs: getLogs,
        addLog: addLog,
        deleteLog: deleteLog,
        addStatus: addStatus,
        getStatus: getStatus,
        deleteStatus : deleteStatus,
    };

});