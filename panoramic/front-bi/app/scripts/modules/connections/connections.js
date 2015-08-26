angular.module( 'app.connections', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'connections', {
    url: '/connections',
    views: {
      "main": {
        controller: 'ConnectionsCtrl',
        templateUrl: 'scripts/modules/connections/connections.tpl.html'
      }
    },
    data:{ pageTitle: 'Connections' }
  });
})

.controller( 'ConnectionsCtrl', function ConnectionsCtrl( $scope, dataServices,$http,$timeout) {

// Declaracion de variables
  
  $scope.showNewForm = false;
  $scope.showEditForm = false;
  $scope.isTested = false; 
  $scope.msjTest = ""; 
  // Declaracion de funciones

  //Lista de managers
    $scope.getManagers = function () {
        $scope.loading = true;
        dataServices.getManagers().success(function (data) {
            $scope.managersList = data;
            $scope.loading = false;
        });
    };

      //Lista de Connections
    $scope.getConnections = function () {
        $scope.loading = true;
        dataServices.getConnections().success(function (data) {
            $scope.data = data;
            $scope.loading = false;
        });
    };

         //Lista de BuildReport
    $scope.getBuildReport = function (alias) {
        $scope.loading = true;

        $http.get(serverURL +'Connection/setConnection').success(function (data) {
            $scope.data = data;
            $scope.loading = false;
        });
    };

          //Lista de Connections
    $scope.testConnection = function () {
        $scope.loading = true;
        var data= {};
        data=$scope.form;
         $http({
              url: serverURL +'Connection/testConnection',
              data: angular.toJson(data),
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=UTF-8' }
          }).success(function (data) {
              $scope.successMsg = 1;
              $scope.errorMsg = 0;
              $scope.isTested = data.success;
              $scope.msjTest= data.message;
              $timeout(function () {
                  $scope.successMsg = 0;
              }, 3000);
          }).error(function (err) {
              $scope.successMsg = 0;
              $scope.errorMsg = 1;
              $timeout(function () {
                  $scope.errorMsg = 0;
              }, 3000);
          });
          
    };

 //Función para guardar
    $scope.save = function () {

      var data= {};
      data=$scope.form;

       $http({
            url: serverURL + 'connection',
            data: angular.toJson(data),
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $scope.showNewForm = false;
            $scope.clearNewForm();
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getBuildReport(data.alias);
            $scope.getConnections();
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
     
       $http({
            url: serverURL + 'connection/'+data.id,
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
          
            $scope.getConnections ();
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
            url: serverURL + 'connection/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getConnections ();
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
         
          console.log (dataServices);
          $scope.showEditForm=true;
          dataServices.getConnectionById(id).success(function (data) {
          $scope.dataFormEdit = data;
          $scope.dataFormEdit.connection_id = data.id;
          delete $scope.dataFormEdit.databases;
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

        // Clear New form
     $scope.clearNewForm = function () {
        $scope.form.alias='';
        $scope.form.database='';
        $scope.form.host='';
        $scope.form.managers_id='';
        $scope.form.port='';
        $scope.form.user='';
        $scope.form.password='';
        $scope.form.is_system='';
        $scope.isTested = false; 
        $scope.msjTest = ""; 
     };

});
