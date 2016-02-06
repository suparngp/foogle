/**
 * Created by suparngupta on 2/4/16.
 */
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 100);
var app = angular.module('app', ['ui.router', 'ngSanitize', 'infinite-scroll']);

app.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "partials/search-home.html"
        })
        .state('results', {
            url: '/results?query',
            templateUrl: 'partials/search-results.html',
            controller: 'SearchResult'
        });
});

app.controller('Main', function ($scope, network, $state) {
    $scope.updateQuery = function (query) {
        console.log("I am sending request to server");
        network.suggestions(query)
            .then(function (results) {
                $scope.results = results;
            })
            .catch(console.error);
    };
    $scope.submit = function (query) {
        $state.go('results', {query: query});
    };
});


app.controller('SearchResult', function ($scope, $http, network, $stateParams) {

    $scope.updateQuery = function (query) {
        console.log("I am sending request to server");
        network.suggestions(query)
            .then(function (results) {
                $scope.results = results;
            })
            .catch(console.error);
    };


    $scope.reload = function () {
        var query = $stateParams.query;
        $scope.search = {query: query, show: query, results: [], start: 0};
        $scope.results = [];
        $scope.goToResult();
    };
    $scope.goToResult = function () {
        if ($scope.search.pending) {
            return;
        }
        var start = $scope.search.start;
        var query = $scope.search.query;
        $scope.search.pending = true;
        $http.get('/api/search?query=' + query + '&start=' + start)
            .then(function (response) {
                $scope.search.start += 10;
                $scope.search.results.push(response.data);
                $scope.search.pending = false;
            })
            .catch(function (error) {
                console.error(error);
            });
    };
    $scope.reload();
});

app.directive('suggestions', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/suggestions.html',
        scope: {
            "results": "=",
            "search": "="
        },
        link: function (scope, elem) {
            $('body').keydown('input', function (e) {
                if (!elem.is(":visible") || !scope.results || !scope.results.length || (e.keyCode !== 40 && e.keyCode !== 38)) {
                    console.log("returning");
                    return;
                }
                scope.$apply(function(scope){
                    var index = _.findIndex(scope.results, {active:true});
                    scope.results.map(function(result){
                        result.active = false;
                    });
                    switch(e.keyCode) {
                        case 40:
                            e.preventDefault();
                            if(index >= 0 && index + 1 < scope.results.length){
                                scope.results[++index].active = true;
                            }
                            else {
                                index = 0;
                                scope.results[0].active = true;
                            }

                            scope.search.query = scope.results[index].show.replace(/<[^>]+>/ig,"");
                            break;
                        case 38:
                            e.preventDefault();
                            if(index >= 0 && index - 1 > -1){
                                scope.results[--index].active = true;
                            }
                            else {
                                index = scope.results.length - 1;
                                scope.results[scope.results.length - 1].active = true;
                            }
                            scope.search.query = scope.results[index].show.replace(/<[^>]+>/ig,"");
                            break;
                    }
                });
            });
        }
    }
});

app.service('network', function ($q, $http) {
    return {
        suggestions: function (query) {
            var defer = $q.defer();
            $http.get('/api/complete?query=' + query)
                .then(function (response) {
                    console.log(response.data);
                    var results = _.uniq(response.data.map(function (arr) {
                        if (arr.length === 4) {

                            var variations = _.values(arr[3]).filter(function(variation){
                                return !!variation;
                            });
                            var show =  (arr[0] + ' - ' + variations.join(', '));
                            return {
                                query: (arr[3].c || arr[3].za).replace(/<[^>]+>/gm, ''),
                                show: show
                            };
                        }
                        else {
                            return {
                                query: arr[0].replace(/<[^>]+>/gm, ''),
                                show: arr[0]
                            }
                        }
                    }).filter(function (result) {
                        return !!result.query;
                    }));
                    defer.resolve(results);
                })
                .catch(function (error) {
                    console.error(error);
                    defer.reject(error);
                });
            return defer.promise;
        }
    };
});

