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
        Database.saveNotSampled($scope.currentUser._id, $scope.beer.name).then(res => {
            $scope.sampledSelected = true;
            $scope.sampledSaved = true;
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
            $scope.sampledSaved = true;
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

app.controller('sampledCtrl', function($scope, Database) {
    Database.getSampledBeers($scope.currentUser._id).then(res => {
        $scope.beers = res.data;
    });

    $scope.removeBeer = function(id, beer) {
        var index = $scope.beers.indexOf(beer);

        Database.removeBeer(id).then(res => {
            $scope.beers.splice(index, 1);
        });
    };
    
    var editingIndex;
    
    $scope.editBeer = function(id, beer) {
        editingIndex = $scope.beers.indexOf(beer);
        $scope.beerToEdit = angular.copy(beer);
    };

    $scope.saveEdit = function() {
        Database.saveChanges($scope.beerToEdit._id, $scope.beerToEdit).then(res => {
            $scope.beers[editingIndex] = $scope.beerToEdit;
            $scope.beerToEdit = null;
        });
    };

    $scope.cancelEdit = function() {
        $scope.beerToEdit = null;
    };
});

app.controller('unsampledCtrl', function($scope, Database) {
    Database.getNotSampled($scope.currentUser._id).then(res => {
        $scope.beers = res.data[0].beersNotSampled;
    });
    
    var beerName;

    $scope.sampled = function(name) {
        $scope.sampleToEdit = true;
        beerName = name;
    };
    
    $scope.saveEdit = function() {
        var beerObj = {
            name: beerName,
            id: 1,
            rating: $scope.newBeer.rating,
            comments: $scope.newBeer.comments
        };

        Database.saveRating(beerObj, $scope.currentUser._id).then(res => {
            return Database.toggleSampled($scope.currentUser._id, {beerName: beerName});
        }).then(res => {
            var index = $scope.beers.indexOf(beerName);
            $scope.beers.splice(index, 1);

            $scope.newBeer = {};
            $scope.sampleToEdit = false;
        });
    };
    
    $scope.cancelEdit = function() {
        $scope.newBeer = {};
        $scope.sampleToEdit = false;
    };
});

app.controller('profileCtrl', function() {

});