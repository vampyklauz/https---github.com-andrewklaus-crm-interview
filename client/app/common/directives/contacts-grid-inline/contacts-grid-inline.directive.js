'use strict';

app.directive('contactsGridInline', function() {
    var path1 = '/app/common/directives/contacts-grid-inline/contacts-grid-inline';
    return {
        restrict: 'E',
        templateUrl: path1+'.view.html',

        scope: {},
        bindToController: {
            grid: '=',
            companyId: '=',
            height: '@',
            api: '='
        },
        controller: 'ContactsGridInlineController',
        controllerAs: 'vm',
        resolve: {
            loadMyCtrl: function($ocLazyLoad) {
                return $ocLazyLoad.load(path1+'.controller.js');
            }
        }
    };
});


angular.module(app.name).controller('ContactsGridInlineController', function($scope, $http, $timeout, $compile, ContactStatuses, ConfirmPopupModal) {

    //------------------------------------------------------------------------------------------------------------------------------------
    //INIT VARIABLES
    //------------------------------------------------------------------------------------------------------------------------------------
    var vm = this;
    vm.ContactStatuses = ContactStatuses.slice(0);


    //HELPERS
    vm.ContactStatusDropDownEditor = function(container, options) {
        console.log('dropdown');
        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataTextField: "name",
                dataValueField: "code",
                dataSource: {
                    data: vm.ContactStatuses
                }
            });
    };

    // Two-way binding between the parent/child controllers
    $timeout(function(){
        // Bind the local variables to the parent API
        vm.api.iBeingEdited = vm.isContactsBeingEdited;
        vm.api.apply        = vm.apply;
    });


    //------------------------------------------------------------------------------------------------------------------------------------
    //GRID SETTINGS
    //------------------------------------------------------------------------------------------------------------------------------------
    vm.gridOptions = {
        dataSource: {
            transport: {
                read: function(options) {
                    // Skip the request if there id no ID
                    if (vm.companyId<=0) {
                        options.success({});
                        return;
                    }
                    $http.get('/api/contacts/bycompany/'+vm.companyId, {
                            params: options.data
                        })
                        .then(
                            // success callback
                            function(response) {
                              vm.grid.dataSource.online(false);
                              options.success(response.data);
                            },
                            // error callback
                            function(response) {
                                options.error(response);
                            }
                        );
                }            },
            serverSorting: false,
            schema: {
                data: "list",
                total: "total",
                groups: 'groups',
                model: {
                    id: "id",
                    fields: {
                        firstName: {
                            type: "string",
                            validation: {
                                required: {message: "First name is required"}
                            }
                        },
                        lastName: {
                            type: "string",
                            validation: {
                                required: {message: "Last name is required"}
                            }
                        },
                        title: {
                            type: "string",
                            validation: {
                                required: {message: "Title is required"}
                            }
                        },
                        company: {
                            type: "string"
                        },
                        status: {
                            type: "string",
                            validation: {
                                required: {message: "Status is required"}
                            },
                            defaultValue: 'unverified'
                        },
                        email: {
                            type: "email",
                            validation: {
                                required: {message: "E-mail is required"}
                            },
                            defaultValue: ''

                        },
                        phone: {
                            type: "string"
                        },
                        linkedInUrl: {
                            type: "string"
                        },
                        companyId: {
                            type: "number"
                        },
                    }
                }
            },
        },
        height: vm.height,
        sortable: true,
        scrollable: true,
        selectable: true,
        columnMenu: false,
        resizable: true,
        reorderable: true,
        pageable: false,
        noRecords: true,
        editable: "inline",
        columns: [{
            field: "firstName",
            title: "First Name",
            // width: "15%"
        }, {
            field: "lastName",
            title: "Last Name",
            // width: "15%"
        }, {
            field: "title",
            title: "Title",
            // width: "15%"
        }, {
            field: "email",
            title: "E-mail",
            // width: "15%"
        }, {
            field: "phone",
            title: "Phone",
            // width: "15%"
        }, {
            field: "linkedInUrl",
            title: "LinkedIn",
            // width: "15%"
        }, {
            field: "status",
            title: "Status",
            // width: "15%",
            editor: vm.ContactStatusDropDownEditor,
            template: function(dataItem) {
                var stat1 = _.findWhere(vm.ContactStatuses, {code: dataItem.status});
                return !stat1?"":stat1.name;
            },
            // template: "#=status.code#"
        }, {
            width: 100,
            attributes: {
                "style": "text-align:center"
            },
            command: [{
                name: "editRecord",
                text: "",
                template: '<button type="button" ng-click="vm.editClick(dataItem)" class="btn btn-pure btn-default icon s-btn-grid-action glyphicon glyphicon-pencil"></button>'
            }, {
                name: "deleteRecord",
                text: "",
                template: '<button type="button" ng-click="vm.deleteClick(dataItem)" class="btn btn-pure btn-default icon s-btn-grid-action glyphicon glyphicon-remove"></button>',
            }]
        }],
        edit: function(e) {
            var commandCell = e.container.find("td:last"); //find the command column
            var template = '<button type="button" ng-click="vm.updateClick(dataItem)" class="btn btn-pure btn-default icon glyphicon glyphicon-saved s-btn-grid-action"></button>' +
                           '<button type="button" ng-click="vm.cancelClick(dataItem)" class="btn btn-pure btn-default icon s-btn-grid-action glyphicon glyphicon-ban-circle"></button>';
            var linkFn = $compile(template);
            var content = linkFn($scope);
            commandCell.html(content);
        },
    };


    //------------------------------------------------------------------------------------------------------------------------------------
    //EVENTS
    //------------------------------------------------------------------------------------------------------------------------------------
    vm.addClick = function(dataItem) {
        if (vm.isContactsBeingEdited()) return;
        vm.oldRow = {};
        vm.grid.addRow();
    };

    vm.cancelClick = function(dataItem) {
        // Cancel the row if this is a new entry
        if (!vm.oldRow.uid) {
            vm.grid.cancelRow();
            return;
        }
        // Revert the changes for the existing entry
        vm.grid.saveRow();
        var dataItem = vm.grid.dataSource.getByUid(vm.oldRow.uid);
        for (var ii in vm.grid.dataSource.options.schema.model.fields) dataItem.set(ii, vm.oldRow[ii]);
    };

    vm.updateClick = function(dataItem) {
        if (vm.companyId<=0) vm.grid.dataSource.online(false);
        vm.grid.saveRow();
    };

    vm.editClick = function(dataItem) {
        if (vm.isContactsBeingEdited()) return;
        vm.grid.editRow(dataItem);
        vm.oldRow = {};
        for (var ii in vm.grid.dataSource.options.schema.model.fields) vm.oldRow[ii] = dataItem[ii];
        vm.oldRow.uid = dataItem.uid;
    }

    vm.deleteClick = function(dataItem) {
        // Open the confirmation popup, and wait for async promise
        var params1 = {
            Title: 'Confirm contact delete',
            Query: 'Are you sure you want to delete this contact?',
            LabelDismiss: 'NO',
            LabelApply: 'YES'
        };
        ConfirmPopupModal.open(params1).result.then(function(result) {
            if (!result) return;
            var dataSource = vm.grid.dataSource;
            dataSource.remove(dataItem);
        });
    };

    vm.apply = function(data) {
        // Update the company id and name
        var dataItems = vm.grid.dataSource.data();
        var rows = [];
        for (var i = 0; i < dataItems.length; i++) {
            var dataItem = dataItems[i];
            rows.push({});
            for (var key1 in dataItem.defaults) rows[i][key1] = dataItem[key1];
            rows[i].companyId = data.id;
            rows[i].company = data.name;
            // Remove id field from new rows
            if (rows[i].id<1) delete rows[i].id;
        }
        return {existing:rows,deleted:vm.grid.dataSource._destroyed};
    };

    //------------------------------------------------------------------------------------------------------------------------------------
    //HELPERS
    //------------------------------------------------------------------------------------------------------------------------------------
    vm.isContactsBeingEdited = function() {
        return !!vm.grid&&vm.grid.editable; // Undocumented feature to detect if in edit mode or not
    };

});
