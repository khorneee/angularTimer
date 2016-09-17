/**
 * Created by adminlocal on 17/09/2016.
 */
angular.module('angularTimer').factory('timerFactory', [ '$http', '$q', '$window', function($http, $q, $window) {

    var indexedDB = $window.indexedDB;
    var db = null;
    var lastIndex = 0;

    return {
        //OPEN DB
        openDB : function(){
            var deferred = $q.defer();
            var version = 2;
            var request = indexedDB.open("timerDB", version);

            request.onupgradeneeded = function (e) {
                db = e.target.result;

                e.target.transaction.onerror = indexedDB.onerror;

                //if (db.objectStoreNames.contains("timer")) {
                    db.deleteObjectStore("timer");
                //}

                var store = db.createObjectStore("logs", {
                    keyPath: "id"
                });

                var store2 = db.createObjectStore("todo", {
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
        },




        //GET LOG
        getLogs : function () {
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
                        deferred.resolve(todos);
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
        },

        //ADD LOG
        addLog : function (log) {
            var deferred = $q.defer();

            if (db === null) {
                deferred.reject("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction(["logs"], "readwrite");
                var store = trans.objectStore("todo");
                lastIndex++;
                var request = store.put({
                    "id": lastIndex,
                    "text": log
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
        },


        getLogss : function(){

        },



        addLogs : function(){

        }
    }
}]);