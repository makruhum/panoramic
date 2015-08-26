angular.module( 'app.objects', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate'
])

    .config(function config( $stateProvider ) {
    $stateProvider.state( 'objects', {
        url: '/objects',
        views: {
            "main": {
                controller: 'ObjectsCtrl',
                templateUrl: 'scripts/modules/objects/objects.tpl.html'
            }
        },
        data:{ pageTitle: 'Objects' }
    });
})

    .controller( 'ObjectsCtrl', function ObjectsCtrl( $scope, dataServices,$http,$timeout, $rootScope, $modal) {

    // Declaracion de variables
    $scope.showNewForm = false;
    $scope.showEditForm = false;
    $scope.form = {};
    var users=[]; //usada para almacenar los usuarios con que se comparten los objetos

    // Declaracion de funciones

    //Lista de connections
    $scope.getConnections = function () {
        $scope.loading = true;
        dataServices.getConnections().success(function (data) {
            $scope.connectionsList = data;
            $scope.loading = false;
        });
    };

    //Lista de Objects
    $scope.getObjects = function () {
        $scope.loading = true;
        dataServices.getObjects().success(function (data) {
            $scope.data = data;
            $scope.loading = false;
        });
    };

    //asigna a la variable users los elementos que seran guardados en base de datos
    setUsers = function(){
        users=[];
        console.log($rootScope.currentUser.id);
        users.push($rootScope.currentUser.id);
        if(typeof($scope.selected)!="undefined" && $scope.selected.length>0){
            for(var i=0;i<$scope.selected.length;i++){
                users.push($scope.selected[i].id);
            }
        }

    };
    //Función para guardar
    $scope.save = function () {

        //$scope.form.users=$rootScope.currentUser.id;
        setUsers();
        /*users.push($rootScope.currentUser.id);
        if($scope.selected.length>0){
            for(var i=0;i<$scope.selected.length;i++){
                users.push($scope.selected[i].id);
            }
        }*/
        $scope.form.users=users;
        var data= {};
        data=$scope.form;
        $http({
            url: serverURL + 'objects',
            data: angular.toJson(data),
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $scope.showNewForm = false;
            $scope.clearForm();
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getObjects();
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

        setUsers();
        $scope.dataFormEdit.users=users;
        data=$scope.dataFormEdit;
        $http({
            url: serverURL + 'objects/'+data.id,
            data: angular.toJson(data),
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $scope.showEditForm = false;
            $scope.clearForm();
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getObjects();
        }).error(function (err) {
            $scope.successMsg = 0;
            $scope.errorMsg = 1;
            $timeout(function () {
                $scope.errorMsg = 0;
            }, 3000);
        });
    };

    // Clear New form
    $scope.clearForm = function () {
        $scope.form= {};
        $scope.dataFormEdit={};
        $scope.selected=[];
    };


    //Función para eliminar
    $scope.deleteRow = function (id) {
        console.log('Delete');
        var data= {};
        $http({
            url: serverURL + 'objects/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getObjects();
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
        dataServices.getObjectById(id).success(function (data) {
            $scope.dataFormEdit = data;
            $scope.dataFormEdit.object_id = data.id;
            $scope.selected=$scope.dataFormEdit.users;
            delete $scope.dataFormEdit.objects_reports;
            delete $scope.dataFormEdit.createdAt;
            delete $scope.dataFormEdit.updatedAt;
            $scope.loading = false;
        });

    };

    //  funcion para limpiar al cancelar
    $scope.cancelEdit = function (id) {
        console.log('Cancelar Editar -- flush data formEdit');
        $scope.dataFormEdit = {};
        $scope.showEditForm=false;
    };

    //  funcion para testQuery
    $scope.testQuery = function (row) {
        console.log(row);
    };

    //-----------------------------------Modals Views----------------------------------------

    $scope.animationsEnabled = true;
    //$scope.items = ['item1', 'item2', 'item3'];


    $scope.open = function (size) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'ModalContent.html',
            controller: 'ModalInstanceCtrl',
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

}) //fin de primer controlador
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, dataServices) {

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

});