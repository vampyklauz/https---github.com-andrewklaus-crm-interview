'use strict';

app.config(function($stateProvider) {
    var path1 = 'app/components/home/home';
    $stateProvider.state('Home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: path1+'.view.html',
        resolve: {
            loadMyCtrl: function($ocLazyLoad) {
                return $ocLazyLoad.load(path1+'.controller.js').then(function(){},function(error){
                    console.log('Resolve error occurred:',error)
                });
            }
        }
    });
});
