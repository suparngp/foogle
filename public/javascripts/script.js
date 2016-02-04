/**
 * Created by suparngupta on 2/4/16.
 */

var app = angular.module('app', ['ui.router', 'ngSanitize']);

app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "partials/search-home.html",
            controller: 'Home'
        })
        //.state('state1.list', {
        //    url: "/list",
        //    templateUrl: "partials/state1.list.html",
        //    controller: function($scope) {
        //        $scope.items = ["A", "List", "Of", "Items"];
        //    }
        //})
});

app.controller('Home', function($scope, $http){
    $scope.updateQuery = function(query){
        console.log("I am sending request to server");
        $http.get('/api/complete?query=' + query)
            .then(function(response){
                console.log(response.data);
                $scope.results = _.uniq(response.data.map(function(arr){
                    if(arr.length === 4){
                        return {
                            query: arr[3].b,
                            show: arr[0] + ' - ' + arr[3].b
                        };
                    }
                    else{
                        return {
                            query: arr[0],
                            show: arr[0]
                        }
                    }
                }).filter(function(result){
                    return !!result.query;
                }));
            })
            .catch(function(error){
                console.error(error);
            });
    };

    $scope.goToResult = function(result){
        var query = result.query.replace(/<[^>]+>/gm, '');
        $scope.results = null;
        $http.get('/api/search?query=' + query)
            .then(function(response){
                $scope.searchResult = response.data;
                console.log(response.data);
            })
            .catch(function(error){
                console.error(error);
            });
        console.log(query);
    }
});