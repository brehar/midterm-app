'use strict';

var app = angular.module('myApp');

app.service('Auth', function($http) {
    this.getProfile = () => {
        return $http.get('/api/users/profile');
    };

    this.registerUser = newUser => {
        return $http.post('/api/users/register', newUser);
    };

    this.loginUser = user => {
        return $http.post('/api/users/authenticate', user);
    };

    this.logoutUser = () => {
        return $http.delete('/api/users/logout');
    };
});

app.service('Beers', function($http) {
    this.getRandom = () => {
        return $http.get('/api/brewerydb/random');
    };
});

app.service('Database', function($http) {
    this.saveSampled = (userId, beerId) => {
        return $http.post(`/api/users/${userId}/saveSampled/${beerId}`);
    };

    this.saveNotSampled = (userId, beerName) => {
        return $http.post(`/api/users/${userId}/saveNotSampled/${beerName}`);
    };
    
    this.saveRating = (beerObj, userId) => {
        return $http.put(`/api/beers/save/${userId}`, beerObj);
    };
    
    this.getSampledBeers = userId => {
        return $http.get(`/api/beers/sampled/${userId}`);
    };
    
    this.saveChanges = (beerId, beer) => {
        return $http.put(`/api/beers/${beerId}`, beer);
    };
    
    this.removeBeer = id => {
        return $http.delete(`/api/beers/${id}`);
    };
    
    this.getNotSampled = user => {
        return $http.get(`/api/users/notSampled/${user}`);
    };

    this.toggleSampled = (user, beerName) => {
        return $http.put(`/api/users/toggleSampled/${user}`, beerName);
    };
});