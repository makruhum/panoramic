angular.module( 'app.kpi', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
])
    .config(function config( $stateProvider ) {
    $stateProvider.state( 'kpi', {
        url: '/kpi',
        views: {
            "main": {
                controller: 'KpiCtrl',
                templateUrl: 'scripts/modules/kpi/kpi.tpl.html'
            }
        },
        data:{ pageTitle: 'KPI' }
    });
})
    .controller( 'KpiCtrl', function TableCtrl( $scope, $filter, dataServices,$http,$timeout, localStorageService,$modal, $log, $rootScope) {
    $scope.form={};
    $scope.rows = [];
    $scope.cols = [];
    $scope.array = [];
    $scope.tableData =[];
    $scope.dataTable= [];
    $scope.tableRendered=[];
    $scope.showForm='new';
    $scope.showNewForm = false;
    $scope.showEditForm = false;
    $scope.fields = [];
    $scope.limit= {value:100};
    $scope.arrayLimit = [
        {value:10},
        {value:100},
        {value:1000},
        {value:10000},
        {value:'*'}
    ];
    var users=[]; //usada para almacenar los usuarios con que se comparten los objetos
    $scope.cancel = function () {
        $scope.showNewForm = false;
        $scope.showEditForm = false;
        $scope.selected=[];
    };
    $scope.loadFormEdit = function (id) {
        $scope.showNewForm = false;
        $scope.showEditForm = true;
        $http({
            url: serverURL + 'kpi/'+id,
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.formEdit=data;
            $scope.selected=$scope.formEdit.users;
            $scope.string=data.metric;
        }).error(function (err) {
        });
    };
    //asigna a la variable users los elementos que seran guardados en base de datos
    setUsers = function(){
        users=[];
        users.push($rootScope.currentUser.id);
        if(typeof($scope.selected)!="undefined" && $scope.selected.length>0){
            for(var i=0;i<$scope.selected.length;i++){
                users.push($scope.selected[i].id);
            }
        }

    };
    //Función para eliminar
    $scope.deleteRow = function (id) {
        var data= {};
        $http({
            url: serverURL + 'kpi/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getKpi ();
        }).error(function (err) {
            $scope.successMsg = 0;
            $scope.errorMsg = 1;
            $timeout(function () {
                $scope.errorMsg = 0;
            }, 3000);
        });
    };
    $scope.getKpi = function () {
        $http({
            url: serverURL + 'kpi/',
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.dataKpi=data;
        }).error(function (err) {
        });
    };
    var orderBy = $filter('orderBy');
    $scope.clearFilters = function () {
        $scope.rows = [];
        $scope.cols = [];
    };
    //Lista de Objects
    $scope.getObjects = function () {
        $scope.loading = true;
        dataServices.getObjects().success(function (data) {
            $scope.objectList = data;
            $scope.loading = false;
        });
    };
    $scope.metricString=[];
    $scope.fieldsArray=[];
    $scope.getKPIString = function (keyboard,value) {
        if(keyboard===undefined) {
            $scope.metricString.push(value);
            $rootScope.$broadcast('getKPIString', value);
            return true;
        }
        else {
            $scope.fieldsArray.push(value);
            $scope.metricString.push(value);
            $rootScope.$broadcast('getKPIString', value);
            return false;
        }
    };
    $scope.getKPIMetric = function () {
        var dataMetric= {"metric":$scope.string,"fields":$scope.fieldsArray,"data":$scope.dataTable};
        $http({
            url: serverURL + 'objects/getKPIMetric',
            method: 'POST',
            data: dataMetric,
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.metricNumber=data.metric;
            console.log($scope.metricNumber);
        }).error(function (err) {
        });
    };
    $scope.getFields = function () {
        $http({
            url: serverURL + 'objects/getColumns/'+$scope.form.objects_id+'?limit='+$scope.limit.value,
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            // for (var i = 0; i < data.fields.length; i++) {
            //   $scope.fields.push(data.fields[i].title);
            // }
            // console.log(data.data);
            $scope.dataTable=data.data;
            $scope.dataFields=data.fields;
        }).error(function (err) {
        });
    };
    //Función para getData
    $scope.getData = function () {
        $scope.rows=localStorageService.get('pivot').rows;
        $scope.columns=localStorageService.get('pivot').cols;
        var data = {};
        data.rows = $scope.rows;
        data.columns =  $scope.columns;
        data.id =  $scope.form.objects_id;
        $http({
            url: serverURL + 'objects/getColumns',
            method: 'POST',
            data: data,
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            // $scope.fields=data.fields;
            $scope.tableData = pivot(data.data, $scope.rows,  $scope.cols, {});
            $scope.array = [];
            $scope.categories=[];
            for (var i = 0; i < $scope.tableData.length; i++) {
                for (var j = 0; j < $scope.tableData[i].length; j++) {
                    if ($scope.tableData[i][j]!==undefined) {
                        for (var k = 0; k < $scope.tableData[i][j].length; k++) {
                            if ($scope.tableData[i][j][k]!==null   ) {
                                $scope.array.push($scope.tableData[i][j][k]);
                            }
                        }
                    }
                }
            }
            submit('pivottable',$scope.array);
            for(var x=0; x<$scope.tableData.rowHeaders.length;x++) {
                for(var y=0; y<$scope.tableData.rowHeaders[x].length;y++) {
                    if(y===0) {
                        $scope.categories.push($scope.tableData.rowHeaders[x][y]);
                    }
                    else {
                        $scope.categories[x]=$scope.categories[x]+" - "+$scope.tableData.rowHeaders[x][y];
                    }
                }
            }
            submit('categories',$scope.categories);
        }).error(function (err) {});
    };
    $scope.editKPIMetric = function () {
        var dataMetric=  {}; var data= {};
        setUsers();
        $scope.formEdit.users=users;
        data = $scope.formEdit;
        console.log(data);
        data.dataMetric= {"metric":$scope.string,"fields":$scope.fieldsArray,"data":$scope.dataTable} ;
        $http({
            url: serverURL + 'kpi/'+data.id,
            method: 'PUT',
            data: data ,
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.showNewForm = false;
            $scope.showEditForm = false;
            $scope.getKpi ();
        }).error(function (err) {
        });
    }
    $scope.saveKPIMetric = function () {
        var dataMetric=  {}; var data= {};
        setUsers();
        $scope.form.users=users;
        data = $scope.form;
        console.log(data);
        data.dataMetric= {"metric":$scope.string,"fields":$scope.fieldsArray,"data":$scope.dataTable} ;
        console.log(data.dataMetric);
        $http({
            url: serverURL + 'objects/saveConfig',
            method: 'POST',
            data: {"data": data },
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.showNewForm = false;
            $scope.showEditForm = false;
        }).error(function (err) {
        });
    }
    //-----------------------------------Modals Views----------------------------------------
    $scope.animationsEnabled = true;
    $scope.openModalObjeto = function (size) {
        var modalInstance = $modal.open({
            animation: false, // Necesito arreglar esto.
            templateUrl: 'ListadoModal.html',
            controller: 'ModalObjects',
            size: size,
            resolve: {
                items: function () {
                    return $scope.form;
                }
            }
        });
        modalInstance.result.then(function (value) {
            console.log ('result:');
            console.log (value);
            if (value=='cancel') return;
            $scope.form.objects_id = value.id;
            $scope.form.name = value.name;
            $scope.form.description = value.description;
            $scope.getFields();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.openUsers = function (size) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'ModalContent.html',
            controller: 'ModalUsers',
            size: size,
            resolve: {
                items: function () {
                    //return $scope.form;
                    if(typeof($scope.selected)=="undefined"){
                        $scope.selected=[];
                    }
                    return $scope.selected;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            console.log($scope.selected);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
            //$scope.selected=$scope.dataFormEdit.users;
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
})
    .controller('ModalObjects', function ($scope, $modalInstance, items,dataServices,$http,$timeout) {
    $scope.loading = false;
    $scope.items = items;
    $scope.objectList = [];
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.seleccionar = function (row) {
        $modalInstance.close(row);
    };
    $scope.cancel = function () {
        $modalInstance.close('cancel');
    };
    //Lista de Objects
    $scope.getObjects = function () {
        $scope.loading = true;
        dataServices.getObjects().success(function (data) {
            $scope.objectList = data;
            $scope.loading = false;
        });
    };
})
    .controller('ModalUsers', function ($scope, $modalInstance, items, dataServices) {

    //$scope.items = items;

    $scope.users=[];//usuarios que se guardaran en base de datos
    //añade un asuario a la lista con que sera compartida el objeto
    $scope.addUser = function(user){
        $scope.users.push(user);
        $scope.usersList.splice($scope.usersList.indexOf(user),1);
        console.log($scope.usersList);
    };
    //elimina el usuario clickeado de la lista de usuarios 
    //con las que sera compartido el objeto
    $scope.removeUser = function(user){
        $scope.usersList.push(user);
        $scope.users.splice($scope.users.indexOf(user),1);

    };
    //cierra la ventana modal y retorna los elementos seleccionados
    $scope.ok = function () {
        $modalInstance.close($scope.users);
    };
    //cierra la ventana modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //Lista de usuarios para usar en ventana modal
    $scope.getUsers = function () {
        $scope.loading = true;
        dataServices.getUsers().success(function (data) {
            $scope.usersList = data;
            $scope.users=items;
            //console.log(items);
            console.log($scope.usersList);
            for(var i=0; i<items.length;i++){
                for(var j=0;j<$scope.usersList.length;j++){
                    if(items[i].id==$scope.usersList[j].id){
                        $scope.usersList.splice(j,1);
                        break;
                    }
                }
            }
            $scope.loading = false;
        });
    };

})

;