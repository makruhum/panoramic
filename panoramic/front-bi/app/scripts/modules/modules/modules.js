angular.module( 'app.modules', [
    'ui.router',
    'ui.bootstrap'
])

    .config(function config( $stateProvider ) {
    $stateProvider.state( 'modules', {
        url: '/modules',
        views: {
            "main": {
                controller: 'ModulesCtrl',
                templateUrl: 'scripts/modules/modules/modules.tpl.html'
            }
        },
        data:{ pageTitle: 'Modules ' }
    });
})

    .controller( 'ModulesCtrl', function ModulesCtrl( $scope, dataServices,$http,$timeout) {
    // Declaracion de variables

    $scope.showNewForm = false;
    $scope.showEditForm = false;

    // Declaracion de funciones

    //Lista de modules
    $scope.getModules = function () {
        $scope.loading = true;
        dataServices.getModules().success(function (data) {
            $scope.data = data;
            $scope.loading = false;
        });
    };

    //Lista de modules
    $scope.getActions = function () {
        $scope.loading = true;
        dataServices.getActions().success(function (data) {
            $scope.actionsList = data;
            $scope.loading = false;
        });
    };

    $scope.selection =[];

    $scope.toggleSelection = function toggleSelection(action) {
        var idx = $scope.selection.indexOf(action);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selection.push(action);
        }
    };

    $scope.exist = function exist(action_id){
        var l=$scope.selection.length;
        for(var i=0; i<l; i++){
            if(action_id==$scope.selection[i]){
                return true;
            }
        }
        return false;
    };

    //Función para guardar
    $scope.save = function () {
        var data= {};

        $scope.form.actions=$scope.selection;
        data=$scope.form;

        $http({
            url: serverURL + 'modules',
            data: angular.toJson(data),
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $scope.showNewForm = false;
            //Clear form 
            $scope.selection="";
            $scope.clearNewForm();
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getModules ();
            $scope.getActions ();
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
        //var

        $scope.dataFormEdit.actions=$scope.selection;
        data=$scope.dataFormEdit;

        $http({
            url: serverURL + 'modules/'+data.id,
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
            $scope.getModules ();
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
            url: serverURL + 'modules/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getModules ();
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
        $scope.selection=[];
        $scope.showEditForm=true;
        dataServices.getModuleById(id).success(function (data) {

            $scope.dataFormEdit = data;
            $scope.dataFormEdit.modules_id = data.id;
            for(var i=0;i<data.actions.length;i++){
                $scope.selection.push(data.actions[i].id);
            }
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
        $scope.form=[];
        $scope.selection =[];
    };


});
