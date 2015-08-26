angular.module( 'app.user', [
    'ui.router',
    'ui.bootstrap'
])
    .config(function config( $stateProvider ) {
    $stateProvider.state( 'user', {
        url: '/user',
        views: {
            "main": {
                controller: 'UserCtrl',
                templateUrl: 'scripts/modules/user/user.tpl.html'
            }
        },
        data:{ pageTitle: 'Users' }
    });
})
    .controller( 'UserCtrl', function UserCtrl( $scope, dataServices,$http,$timeout) {

    $scope.showNewForm = false;
    $scope.showEditForm = false;
    $scope.getRoles = function () {
        $scope.loading = true;
        dataServices.getRoles().success(function (data) {
            $scope.rolList = data;
            $scope.loading = false;
        });
    };

    //Lista de actions
    $scope.getUsers = function () {
        $scope.loading = true;
        $http({
            url: serverURL + 'user',
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/javascript',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).success(function (data) {
            $scope.data = data;
        }).error(function (err) {

        });

    };

    //Función para guardar
    $scope.save = function () {
        var data= {};
        data=$scope.form;
        $http({
            url: serverURL + 'user',
            data: angular.toJson(data),
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $scope.showNewForm = false;
            //Clear form
            $scope.clearNewForm();
            $timeout(function () {
                $scope.successMsg = 0;
                $scope.getUsers();
            }, 3000);
            //$scope.getUsers ();
        }).error(function (err) {
            $scope.successMsg = 0;
            $scope.errorMsg = 1;
            $timeout(function () {
                $scope.errorMsg = 0;
            }, 3000);
        });
    };

    //Función para edit
    $scope.edit = function () {
        var data= {};
        data=$scope.dataFormEdit;
        delete(data.auth);
        console.log(data);
        $http({
            url: serverURL + 'user/'+data.id,
            data: angular.toJson(data),
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $scope.showEditForm = false;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getUsers ();
        }).error(function (err) {
            $scope.successMsg = 0;
            $scope.errorMsg = 1;
            $timeout(function () {
                $scope.errorMsg = 0;
            }, 3000);
        });
    };
    //Función para eliminar
    $scope.deleteRow = function (id) {
        console.log('Delete');
        var data= {};
        $http({
            url: serverURL + 'user/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getUsers ();
        }).error(function (err) {
            $scope.successMsg = 0;
            $scope.errorMsg = 1;
            $timeout(function () {
                $scope.errorMsg = 0;
            }, 3000);
        });
    };
    // funciones auxilares

    // funcion para editar un registro con un formulario
    $scope.loadFormEdit = function (id) {
        console.log('Editando:'+id);
        $scope.showEditForm=true;
        dataServices.getUserById(id).success(function (data) {
            $scope.dataFormEdit = data;
            delete  $scope.dataFormEdit.createdAt;
            delete  $scope.dataFormEdit.updatedAt;
            $scope.loading = false;
        });

    };

    //  funcion para limpiar al cancelar
    $scope.cancelEdit = function (id) {
        console.log('Cancelar Editar -- flush data formEdit');
        $scope.dataFormEdit = {};
        $scope.showEditForm=false;
    };
    // Clear New form
    $scope.clearNewForm = function () {
        $scope.form={};
        $scope.selection=[];
    };


});
