'use strict';

app.config(function ($stateProvider) {
    var path1 = 'app/components/companies/companies';
    var path2 = 'app/components/companies/add-edit-popup/add-edit-popup.modal.js';
    $stateProvider.state('Companies', {
        url: '/companies',
        controller: 'CompaniesController',
        templateUrl: path1+'.view.html',
        resolve: {
            loadMyCtrl: function($ocLazyLoad) {
                return $ocLazyLoad.load(path2).then(function(){
                    return $ocLazyLoad.load(path1+'.controller.js');
                },function(error){
                    console.log('Resolve error occurred:',error)
                });
            }
        }
    });
});
