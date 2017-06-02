'use strict';

app.directive('stateSelect2', function($compile,AllStates) {
    return {
        restrict: 'E',
        templateUrl: '/app/common/directives/state-select2/state-select2.view.html',
        scope: {
            model: '=',
            required: '=',
            name: '@',
            id: '@'
        },

        link: function(scope, element) {

            scope.states = AllStates.slice(0);

            // if(scope.model) {
            //     scope.model = _.find(scope.states, function(item){
            //         return item.stateCode === scope.model.stateCode;
            //     });
            // }
        }
    }
});
