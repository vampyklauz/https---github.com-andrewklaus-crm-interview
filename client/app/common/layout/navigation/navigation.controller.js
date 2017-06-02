'use strict';

angular.module(app.name).controller('NavigationController', function ($scope, $location, $state) {

  $scope.routeExists = function(routeName) {
    return !!$state.href(routeName);
  };

  $scope.goto = function (loc1) {
      $location.href(loc1);
      // $('body').animsition('out', $(this), loc1);
  }
});
