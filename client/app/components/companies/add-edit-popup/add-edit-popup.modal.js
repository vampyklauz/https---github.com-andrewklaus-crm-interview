'use strict';

app.service('CompaniesAddEditModal', function ($uibModal) {
    this.open = function (options) {
        var path1 = '/app/components/companies/add-edit-popup/add-edit-popup';
        return $uibModal.open({
            templateUrl: path1+'.view.html',
            controller: 'CompaniesAddEditPopupController as vm',
            size: 'lg modal-center modal-popup modal-add-edit-popup',
            resolve: {
                options: function () { return options; },
                loadMyCtrl: function($ocLazyLoad) {
                    return $ocLazyLoad.load(path1+'.controller.js').then(function(){},function(error){
                        console.log('Resolve error occurred:',error)
                    });
                }
            }
        });
    };
});
