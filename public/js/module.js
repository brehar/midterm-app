'use strict';

var app = angular.module('myApp', ['ui.router', 'ngLoadingSpinner']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/html/home.html',
        controller: 'homeCtrl',
        resolve: {
            home: function(Auth, $q, $state) {
                return Auth.getProfile().catch(() => {
                    $state.go('register');
                    return $q.reject();
                });
            }
        }
    }).state('register', {
        url: '/register',
        templateUrl: '/html/register.html',
        controller: 'registerCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: '/html/login.html',
        controller: 'loginCtrl'
    }).state('sampled', {
        url: '/sampled',
        templateUrl: '/html/sampled.html',
        controller: 'sampledCtrl',
        resolve: {
            sampled: function(Auth, $q, $state) {
                return Auth.getProfile().catch(() => {
                    $state.go('login');
                    return $q.reject();
                });
            }
        }
    }).state('unsampled', {
        url: '/unsampled',
        templateUrl: '/html/unsampled.html',
        controller: 'unsampledCtrl',
        resolve: {
            unsampled: function(Auth, $q, $state) {
                return Auth.getProfile().catch(() => {
                    $state.go('login');
                    return $q.reject();
                });
            }
        }
    }).state('logout', {
        url: '/logout',
        templateUrl: '/html/logout.html',
        controller: 'logoutCtrl'
    }).state('profile', {
        url: '/profile',
        templateUrl: '/html/profile.html',
        controller: 'profileCtrl',
        resolve: {
            profile: function(Auth, $q, $state) {
                return Auth.getProfile().catch(() => {
                    $state.go('login');
                    return $q.reject();
                });
            }
        }
    });

    $urlRouterProvider.otherwise('/');
});