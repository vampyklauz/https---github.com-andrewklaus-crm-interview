'use strict';

'use strict';

app.directive('companyEditInline', function() {
    var path1 = '/app/common/directives/company-edit-inline/company-edit-inline';
    return {
        restrict: 'E',
        templateUrl: path1+'.view.html',

        scope: {},
        bindToController: {
            form: '=',
            next: '&',
            data: '='
        },
        controller: 'CompanyEditInlineController',
        controllerAs: 'vm',
        resolve: {
            loadMyCtrl: function($ocLazyLoad) {
                return $ocLazyLoad.load(path1+'.controller.js');
            }
        }
    };
});


angular.module(app.name).controller('CompanyEditInlineController', function($scope, $http, $timeout, CompanyStatuses) {

    //------------------------------------------------------------------------------------------------------------------------------------
    //INIT VARIABLES
    //------------------------------------------------------------------------------------------------------------------------------------
    var vm = this;
    vm.companyStatuses = CompanyStatuses.slice(0);
});