'use strict';

app.service('ConfirmPopupModal', function ($uibModal) {
  this.open = function (options) {
    return $uibModal.open({
      templateUrl: '../../../../app/common/modals/confirm-popup/confirm-popup.view.html',
      controller: 'ConfirmPopupController',
      size: 'md modal-center modal-popup modal-confirm',
      resolve: {
        options: function () { return options; }
      }
    });
  };
});
