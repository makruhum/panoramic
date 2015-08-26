angular.module( 'app.permission', [
    'ui.router',
    'ui.bootstrap'
])

    .config(function config( $stateProvider ) {
    $stateProvider.state( 'permission', {
        url: '/permission',
        views: {
            "main": {
                controller: 'PermisionCtrl',
                templateUrl: 'scripts/modules/permission/permission.tpl.html'
            }
        },
        data:{ pageTitle: 'Permissions ' }
    });
})

    .controller( 'PermisionCtrl', function PermisionCtrl( $scope, dataServices,$http,$timeout) {
    // Declaracion de variables

    $scope.showNewForm = false;
    $scope.showEditForm = false;
    $scope.form = {};
    $scope.modules =[];
    $scope.form.modulesAuthorized=[];
    $scope.modulesAuthorized=[];
    $scope.permission_id=[];
    var idxModules=0;


    $scope.exists = function (module_id, action_id) {

        var l=$scope.modulesAuthorized.length;
        if(l>0){
            for(var i=0;i<l;i++){
                if(module_id==$scope.modulesAuthorized[i].module_id && action_id==$scope.modulesAuthorized[i].action_id){
                    idxModules=i;
                    return  true;
                }
            }
            return false;
        }else{
            return false;
        }
    };

    $scope.setModulesAuthorized = function(module_id,action_id,permission_id){
        if(typeof(permission_id)=="undefined") {
            permission_id="";
        }
        if($scope.exists(module_id,action_id)){
            $scope.modulesAuthorized.splice(idxModules,1);
            idxModules=0;
        }else{
            $scope.modulesAuthorized.push({"module_id": module_id,
                                           "action_id": action_id,
                                           "permission":permission_id
                                          }
                                         );
        }
    };

    // Declaracion de funciones

    //Lista de permission
    $scope.getPermissions = function () {
        $scope.loading = true;
        dataServices.getPermissions().success(function (data) {
            $scope.data = data;
            $scope.loading = false;
        });
    };
    //Lista de permission
    $scope.getModules = function () {
        $scope.loading = true;
        dataServices.getModules().success(function (data) {
            $scope.listModules = data;
            $scope.loading = false;
        });
    };
    //Lista de roles
    $scope.getRoles = function () {
        $scope.loading = true;
        dataServices.getRoles().success(function (data) {
            $scope.listRoles = data;
            $scope.loading = false;
        });
    };
    //Función para guardar
    $scope.save = function () {
        var data= {};
        $scope.form.modulesAuthorized=$scope.modulesAuthorized;
        data=$scope.form;
        $http({
            url: serverURL + 'permission',
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
            }, 3000);
            $scope.getPermissions();
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
        var id=$scope.modulesAuthorized[0].permission;
        data=$scope.modulesAuthorized;
        $http({
            url: serverURL + 'permission/'+id,
            data: angular.toJson(data),
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $scope.showEditForm = false;
            $timeout(function () {
                $scope.successMsg = 0;
                $scope.getPermissions();
            }, 3000);
            /*$scope.getPermissions();*/
        }).error(function (err) {
            $scope.successMsg = 0;
            $scope.errorMsg = 1;
            $timeout(function () {
                $scope.errorMsg = 0;
            }, 3000);
        });
    };

    $scope.delete = function (id) {
        console.log('Delete');
        var data= {};
        $http({
            url: serverURL + 'permission/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getPermissions ();
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
        $scope.modulesAuthorized=[];
        $scope.showEditForm=true;
        $scope.permission_id=[];
        dataServices.getPermissionById(id).success(function (data) {
            $scope.dataFormEdit = data;
            console.log(data);
            for( var i=0; i < data.modulesAuthorized.length; i++ ){
                $scope.modulesAuthorized.push({"module_id": data.modulesAuthorized[i].module_id,
                                               "action_id": data.modulesAuthorized[i].action_id,
                                               "permission": data.id});
            }
            $scope.permission_id=data.id;
            delete  $scope.dataFormEdit.createdAt;
            delete  $scope.dataFormEdit.updatedAt;          
            $scope.loading = false;
        });

    };

    //  funcion para limpiar al cancelar
    $scope.cancelEdit = function (id) {
        console.log('Cancelar Editar -- flush data formEdit');
        $scope.dataFormEdit = {};
        $scope.modulesAuthorized=[];
        $scope.showEditForm=false;
    };
    // Clear New form
    $scope.clearNewForm = function () {
        $scope.form=[];
        $scope.modulesAuthorized=[];
    };


});
