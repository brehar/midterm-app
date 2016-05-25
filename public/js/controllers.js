'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, Auth) {
    function checkLoggedIn() {
        Auth.getProfile().then(res => {
            $scope.currentUser = res.data;
        }).catch(err => {
            $scope.currentUser = null;
        });
    }

    checkLoggedIn();

    $scope.$on('loggedin', function() {checkLoggedIn()});
    $scope.$on('loggedout', function() {checkLoggedIn()});

    $('.button-collapse').sideNav();
});

app.controller('homeCtrl', function($scope, Beers, Database) {
    Beers.getRandom().then(res => {
        $scope.beer = res.data.data;
    });

    $scope.sampled = function() {
        Database.saveSampled($scope.currentUser._id, $scope.beer.id).then(res => {
            $scope.sampledSelected = true;
        });
    };

    $scope.notSampled = function() {
        Database.saveNotSampled($scope.currentUser._id, $scope.beer.id).then(res => {
            $scope.sampledSelected = true;
        });
    };
    
    $scope.submitRating = function() {
        var beerObj = {
            name: $scope.beer.name,
            id: $scope.beer.id,
            rating: $scope.newBeer.rating,
            comments: $scope.newBeer.comments
        };

        Database.saveRating(beerObj, $scope.currentUser._id).then(res => {
            alert('rating saved');
        });
    };
});

app.controller('registerCtrl', function($scope, $state, Auth) {
    $scope.registerUser = function() {
        Auth.registerUser($scope.newUser).then(res => {
            return Auth.loginUser($scope.newUser);
        }).then(res => {
            $scope.$emit('loggedin');
            $state.go('home');
        });
    };
});

app.controller('loginCtrl', function($scope, $state, Auth) {
    $scope.loginUser = function() {
        Auth.loginUser($scope.user).then(res => {
            $scope.$emit('loggedin');
            $state.go('home');
        });
    };
});

app.controller('logoutCtrl', function($scope, $state, Auth) {
    Auth.logoutUser().then(res => {
        $scope.$emit('loggedout');
        $state.go('home');
    });
});

app.controller('sampledCtrl', function() {

});

app.controller('unsampledCtrl', function() {
    
});

app.controller('profileCtrl', function() {

});