'use strict';

/*exported app*/
var app = angular.module('synergy360-crm-app', [
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'kendo.directives',
	'ngMessages',
    'oc.lazyLoad'
]);


app.config(function ($urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('');
});

app.run(function($rootScope) {
    console.log('App is running successfully');
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $('body').animsition('in');
    });
});

