'use strict';

angular.module(app.name).controller('CompaniesAddEditPopupController', function(
    $scope, $http, $timeout, CompanyStatuses, ConfirmPopupModal, $uibModalInstance, options) {
    var vm = this;

    vm.dataItem = options.dataItem;
    vm.title = options.title;
    vm.LabelApply = options.LabelApply;
    vm.LabelDismiss = options.LabelDismiss;

    vm.isCompanyOpen = true;
    vm.isCannotSaveContacts = false;

    vm.dataItem.id = (vm.dataItem.id)?options.dataItem.id:0;

    vm.companyStatuses = CompanyStatuses.slice(0);


    vm.companyAPI = {};
    vm.contactsAPI = {};

    vm.step1 = 'current';
    vm.step2 = '';

    vm.loadCompanyData = function() {
        $http.get("/api/companies/"+vm.dataItem.id)
            .then(
                // success callback
                function(response) {
                    console.log('got company data:',response.data);
                    for (var ii in response.data) vm.dataItem[ii] = response.data[ii];
                },
                // error callback
                function(response) {
                    // TODO show error of somesort
                }
            );
    };

    if (vm.dataItem.id>0) {
        vm.title = "Edit Company";
        vm.loadCompanyData();
    }
    else {
        vm.title = "Add Company";
    }


    vm.remove = function() {
        $uibModalInstance.close('DeleteRecord');
    };

    // Go to the next section
    vm.next1 = function(step) {
        vm.step(step);
    };

    vm.step = function(step){
        switch(step){
            case 'company': vm.step1 = 'current'; vm.step2 = ''; break;
            case 'contact': 
                if( validate() ){
                    vm.step2 = 'current'; vm.step1 = 'done'; 
                }
            break;
        }
    }

    function validate(){
        angular.forEach(vm.companyForm.$error.required, function(field) { field.$setDirty(); });
        vm.companyForm.$setSubmitted();
        if (vm.companyForm.$valid) {
            return true;
        }else{
            return false;
        }
    }


    // Initiate saving process: send the msg to [Contacts]
    vm.save = function() {
        vm.isCannotSaveContacts = vm.contactsAPI.iBeingEdited();
        if (vm.companyForm.$invalid) return;
        if (vm.isCannotSaveContacts) return;

        console.log(vm.dataItem);
        vm.dataItem.statusLabel = vm.companyStatuses.find(function (o) { return o.code == vm.dataItem.statusCode; }).name;
        if (vm.dataItem.id>0) {
            $http.post('/api/companies/' + vm.dataItem.id, vm.dataItem)
                .then( // success
                    function (response) { vm.saveContacts(response); },
                       // error
                    function (response) { /* TODO show error */ }); 
        } else {
            delete vm.dataItem.id;
            $http.put('/api/companies', vm.dataItem)
                .then( // success
                    function (response) { vm.saveContacts(response); },
                       // error
                    function (response) { /* TODO show error */ });
        }
    };
    
    vm.saveContacts = function (response) {
        // update the variables from the server
        for (var key in response.data) vm.dataItem[key] = response.data[key];
        var contacts = vm.contactsAPI.apply(response.data);

        // skip saving if there are no contacts
        if (contacts.existing.length==0 && contacts.deleted.length==0) {
            $uibModalInstance.close(true);
            return;
        }

        // Save the contacts
        $http.post('/api/contacts/batch', contacts)
            .then(
                // success
                function(response) {
                    console.log('batch insert complete',response);
                    $uibModalInstance.close(true);
                },
                // error
                function(response) {
                    // TODO show error
                });
    };


    // Cancel button click
    vm.cancel = function() {
        $uibModalInstance.close(false);
    };
});
