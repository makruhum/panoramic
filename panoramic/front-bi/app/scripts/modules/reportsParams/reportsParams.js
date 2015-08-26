angular.module( 'app.reportsParams', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'reportsparams', {
    url: '/reportsparams',
    views: {
      "main": {
        controller: 'ReportsParamCtrl',
        templateUrl: 'scripts/modules/reportsParams/reportsParams.tpl.html'
      }
    },
    data:{ pageTitle: 'Reports Params ' }
  });
})

.controller( 'ReportsParamCtrl', function ReportsParamCtrl( $scope, dataServices,$http,$timeout) {
  // Declaracion de variables
  
  $scope.showNewForm = false;
  $scope.showEditForm = false;
  
  // Declaracion de funciones

  //Lista de reportsParams
    $scope.getReporstParams = function () {
        $scope.loading = true;
        dataServices.getReporstParams().success(function (data) {
            $scope.data = data;
            $scope.loading = false;
        });
    };

    //Lista de connections
    $scope.getReportTypes = function () {
      $scope.loading = true;
      dataServices.getReportTypes().success(function (data) {
        $scope.reportTypesList = data;
        $scope.loading = false;
      });
    };

 //Función para guardar
    $scope.save = function () {
      var data= {};
      data=$scope.form;

       $http({
            url: serverURL + 'reportsparams',
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
            $scope.getReporstParams ();
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
            url: serverURL + 'reportsparams/'+data.id,
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
            $scope.getReporstParams ();
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
            url: serverURL + 'reportsparams/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getReporstParams ();
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
          $scope.showEditForm=true;
          dataServices.getReportsParamsById(id).success(function (data) {

              $scope.dataFormEdit = data;

              $scope.dataFormEdit.reprots_params_id = data.id;
              //delete  $scope.dataFormEdit.connections;
              delete  $scope.dataFormEdit.createdAt;
              delete  $scope.dataFormEdit.updatedAt;
              
              $scope.loading = false;
          });

    };

     //  funcion para limpiar al cancelar
    $scope.cancelEdit = function (id) {
          
      $scope.dataFormEdit = {};
      $scope.showEditForm=false;
    };
    // Clear New form
     $scope.clearNewForm = function () {
        $scope.form.report_types_id='';
        $scope.form.param_name='';
        $scope.form.format='';
        $scope.form.type='';
     };


});