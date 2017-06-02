'use strict';
angular.module(app.name).controller('CompaniesController', function(
    $scope, $http, $compile, $state,$timeout,AllStates,CompanyStatuses,GlobalFunctions,
    CompaniesAddEditModal, ConfirmPopupModal) {

    //------------------------------------------------------------------------------------------------------------------------------------
    //INIT VARIABLES
    //------------------------------------------------------------------------------------------------------------------------------------

    $scope.stateFilter = AllStates.slice(0);
    $scope.statusFilter = CompanyStatuses.slice(0);

    $scope.LastUpdate = "";
    $scope.getCurrentDate = GlobalFunctions.getCurrentDate;

    //------------------------------------------------------------------------------------------------------------------------------------
    //GRID SETTINGS
    //------------------------------------------------------------------------------------------------------------------------------------
    $scope.gridOptions = {
        dataSource: {
            transport: {
                //read: "//localhost:9000/api/admin/users/getUsers"
                read: function(options) {
                    console.log("read", options);
                    $http.get('/api/companies', {
                            params: options.data
                        })
                        .then(
                            // success callback
                            function(response) {
                              console.log("success", response.data);
                              $scope.LastUpdate = $scope.getCurrentDate();
                              $scope.grid.pager.options.messages.display = "{0} - {1} of {2} items (Last update: "+$scope.LastUpdate+")";
                              options.success(response.data);
                            },
                            // error callback
                            function(response) {
                                options.error(response);
                            }
                        );
                },
                destroy: function(options) {
                    console.log("Destroy", options);
                    var data = options.data.models[0];
                    console.log(data.id);
                    $http.delete('/api/companies/' + data.id)
                        .then(
                            // success callback
                            function(response) {
                                options.success(response.data);
                            },
                            // error callback
                            function(response) {
                                options.error(response);
                            }
                        );
                }
            },
            pageSize: 100,
            refresh: true,
            serverGrouping: true,
            serverSorting: true,
            serverFiltering: true,
            serverPaging: true,
            serverAggregates: true,
            batch: true,
            schema: {
                data: "list",
                total: "total",
                groups: 'groups',
                model: {
                    id: "id",
                    fields: {
                        name: {
                            type: "string"
                        },
                        city: {
                            type: "string"
                        },
                        stateCode: {
                            type: "string"
                        },
                        statusCode: {
                            type: "string"
                        },
                        statusLabel: {
                            type: "string"
                        },
                        statusReasonCode: {
                            type: "string"
                        },						
                    }
                }
            },
        },
        height: 750,
        group: function(e) {
            if (e.groups.length) {
                // Restrict the grouping
                for (var ii=0;ii<e.groups.length;ii++){
                    if (e.groups[ii].field == 'name') {
                        e.preventDefault();
                        return;
                    }
                }
                $scope.gridIsGrouped = true;
            } else {
                $scope.gridIsGrouped = false;
            }
        },
        scrollbar: true,
        sortable: true,
        groupable: false,
        selectable: true,
        filterable: true,
        columnMenu: true,
        resizable: true,
        reorderable: true,
        pageable: {
            pageSize: 25,
            pageSizes: [25,50,100],
            refresh: true
        },
        columns: [{
            field: "name",
            title: "Name",
            width: "30%",
        }, {
            field: "city",
            title: "City",
            width: "30%",
            aggregates: ["count"],
            groupHeaderTemplate: "City: #= value # (Count: #= count#)"
        }, {
            field: "stateCode",
            title: "State",
            width: "20%",
            aggregates: ["count"],
            groupHeaderTemplate: "State: #= value # (Count: #= count#)",
            filterable: {
                multi: true,
                dataSource: $scope.stateFilter,
                search:true,
                itemTemplate: function(e) {
                    console.log(e.field);
                    if (e.field == "all") {
                        //handle the check-all checkbox template
                        return "<li class='k-item' style='min-width: 180px;'><label><input type='checkbox' />#= all#</label></li>";
                    } else {
                        //handle the other checkboxes
                        return "<li class='k-item'><label><input type='checkbox' name='" + e.field + "' value='#=stateCode#'/><span>#= stateName #</span></label></li>"
                    }
                }
            }
        }, {
            field: "statusCode",
            title: "Status",
            width: "20%",
            aggregates: ["count"],
            groupHeaderTemplate: "Status: #= value # (Count: #= count#)",
            template: "#: statusLabel #",
            filterable: {
                multi: true,
                dataSource: $scope.statusFilter,
                itemTemplate: function(e) {
                    console.log(e.field);
                    if (e.field == "all") {
                        //handle the check-all checkbox template
                        return "<li class='k-item' style='min-width: 180px;'><label><input type='checkbox' />#= all#</label></li>";
                    } else {
                        //handle the other checkboxes
                        return "<li class='k-item'><label><input type='checkbox' name='" + e.field + "' value='#=code#'/><span>#= name #</span></label></li>"
                    }
                }
            }
        }, {
            field: "statusReasonCode",
            title: "Status Reason",
            width: "20%",
            aggregates: ["count"],
            groupHeaderTemplate: "Status Code Reason: #= value # (Count: #= count#)",
            filterable: true
        }, {
            width: 100,
            attributes: {
                "style": "text-align:center"
            },
            command: [{
                name: "deleteRecord",
                text: "",
                template: '<button type="button" ng-click="editClick(dataItem)" class="btn btn-pure btn-default icon s-btn-grid-action glyphicon glyphicon-pencil"></button><button type="button" ng-click="deleteClick(dataItem)" class="btn btn-pure btn-default icon s-btn-grid-action glyphicon glyphicon-remove"></button>',

            }]

        }]
    };


    //------------------------------------------------------------------------------------------------------------------------------------
    //EVENTS
    //------------------------------------------------------------------------------------------------------------------------------------

    $scope.editClick = function(dataItem) {
        var newEntry = (dataItem==null);
        var id = dataItem?dataItem.id:0;

        var dataItemCopy = {};
        console.log('Start edit:',dataItem);
        if (dataItem) for (var key1 in dataItem.defaults) dataItemCopy[key1] = dataItem[key1];

        var options = {
           title: "Edit Company",
           dataItem: dataItemCopy,
           LabelDismiss: 'Cancel',
           LabelApply: 'Save',
        };

        // Open the confirmation popup, and wait for async promise
        CompaniesAddEditModal.open(options).result.then(function(result) {
            if (!result) return;
            if (result == 'DeleteRecord') {
                $scope.deleteClick(dataItem);
                return;
            }

            var dataSource = $scope.grid.dataSource;
            console.log('event:',newEntry);
            console.log(dataItemCopy);
            console.log(dataSource);
            if (newEntry) dataSource.insert(0,dataItemCopy);
            else {
                console.log(dataItem);
                console.log(dataItemCopy);
                for (var key1 in dataItemCopy)
                    if (dataItem[key1]!=dataItemCopy[key1]) dataItem.set(key1,dataItemCopy[key1]);
            }
            console.log('End edit:',dataItem);
            // dataSource.sync();
        }, function(res) {
            console.log('Modal dismissed by: ',res);
        });
    };

    $scope.deleteClick = function(dataItem) {
        // Open the confirmation popup, and wait for async promise
        var params1 = {
            Title: 'Delete Company',
            Query: 'Are you sure you want to delete this company?',
            LabelDismiss: 'NO',
            LabelApply: 'YES'
        };
        ConfirmPopupModal.open(params1).result.then(function(result) {
            if (!result) return;
            var dataSource = $scope.grid.dataSource;
            dataSource.remove(dataItem);
            dataSource.sync();
        });
    };


    // Route change event
    $scope.$on('$stateChangeSuccess', function(event, current) {
        $scope.curstate = $state.current.name;

        // Scroll to the top
        $timeout(function(){
            document.body.scrollTop = 0;
            // Update the scrollbar (Kendo initialization does not work properly on a hidden grid)
            if ($scope.grid.virtualScrollable && $scope.grid.virtualScrollable.itemHeight == 0) {
                $scope.grid.virtualScrollable.refresh();
                $scope.grid.refresh();
            }
        });
    });


    //------------------------------------------------------------------------------------------------------------------------------------
    //HELPERS
    //------------------------------------------------------------------------------------------------------------------------------------	
    $scope.refreshGrid = function() {
        $(".k-pager-refresh").trigger('click');
    }

});
