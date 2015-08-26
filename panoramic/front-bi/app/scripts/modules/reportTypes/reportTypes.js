angular.module( 'app.reportTypes', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'reporttypes', {
    url: '/reporttypes',
    views: {
      "main": {
        controller: 'ReportTypesCtrl',
        templateUrl: 'scripts/modules/reportTypes/reportTypes.tpl.html'
      }
    },
    data:{ pageTitle: 'Report Types' }
  });
})

.controller( 'ReportTypesCtrl', function ReportTypesCtrl( $scope, dataServices,$http,$timeout) {
// Declaracion de variables
  
  $scope.showNewForm = false;
  $scope.showEditForm = false;
  
  // Declaracion de funciones

  //Lista de ReportEngines
    $scope.getReportEngines = function () {
        $scope.loading = true;
        dataServices.getReportEngines().success(function (data) {
            $scope.reportEnginesList = data;
            $scope.loading = false;
        });


    };

      //Lista de ReportTypes
    $scope.getReportTypes = function () {
        $scope.loading = true;
        dataServices.getReportTypes().success(function (data) {
            $scope.data = data;
            $scope.loading = false;
        });
    };


 //Función para guardar
    $scope.save = function () {

      var data= {};
      data=$scope.form;

       $http({
            url: serverURL + 'reporttypes',
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
            $scope.getReportTypes();
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
            url: serverURL + 'reporttypes/'+data.id,
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
            $scope.getReportTypes ();
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
            url: serverURL + 'reporttypes/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getReportTypes ();
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
          console.log (dataServices);
          $scope.showEditForm=true;
          dataServices.getReportTypesById(id).success(function (data) {
          $scope.dataFormEdit = data;
          $scope.dataFormEdit.report_engines_id = data.id;
          delete $scope.dataFormEdit.createdAt;
          delete $scope.dataFormEdit.updatedAt;
          delete $scope.dataFormEdit.params;

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
        $scope.form.name='';
        $scope.form.format='';
        $scope.form.report_engines_id='';
     };
});
