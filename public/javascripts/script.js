/**
 * Created by suparngupta on 2/4/16.
 */

var app = angular.module('app', ['ui.router', 'ngSanitize']);

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
    //.state('state1.list', {
    //    url: "/list",
    //    templateUrl: "partials/state1.list.html",
    //    controller: function($scope) {
    //        $scope.items = ["A", "List", "Of", "Items"];
    //    }
    //})
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
        $scope.search = {query: query};
        $scope.results = [];
        $scope.goToResult(query);
    };
    $scope.goToResult = function (query) {
        $http.get('/api/search?query=' + query)
            .then(function (response) {
                $scope.search.results = response.data;
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
            "results": "="
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
                            return {
                                query: arr[3].c.replace(/<[^>]+>/gm, ''),
                                show: arr[0] + ' - ' + arr[3].b
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

app.directive('foogleResults', function () {
    return {
        restrict: 'E',
        scope: {
            search: "="
        },
        link: function (scope, elem) {
            //window.html = scope.search.results;
            var html = $(scope.search.results);
            html.find('script,noscript,style').remove();
            console.log(html);
            //elem.append(html);
        }
    }
});