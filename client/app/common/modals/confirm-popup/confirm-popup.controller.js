'use strict';

angular.module(app.name).controller('ConfirmPopupController', function($scope, $uibModalInstance, options) {
    $scope.options = options;
    
    $scope.Title        = options.Title || '';
    $scope.Query        = options.Query || '';
    $scope.LabelDismiss = options.LabelDismiss || "Cancel";
    $scope.LabelApply   = options.LabelApply || "OK";

    $scope.cancel = function() {
        var result = false;
        $uibModalInstance.close(result);
    };

    $scope.apply = function() {
        var result = true;
        $uibModalInstance.close(result);
    };
    
});