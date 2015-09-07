/**
 * Author: hollyschinsky
 * twitter: @devgirfl
 * blog: devgirl.org
 * more tutorials: hollyschinsky.github.io
 */
//= require angular
//= require angular-resource
//= require angular-route
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require_tree ./angular

var app = angular.module('app', ['ionic','ngCordova', 'ngResource', 'ngRoute'])
    .run(function($ionicPlatform) {
});

app.factory('Dashboard', ['$resource', function ($resource) {
    return $resource('/main/dashboard');
}]);