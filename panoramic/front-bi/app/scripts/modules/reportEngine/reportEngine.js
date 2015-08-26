angular.module( 'app.reportEngine', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'reportengine', {
    url: '/reportengine',
    views: {
      "main": {
        controller: 'ReportEngineCtrl',
        templateUrl: 'scripts/modules/reportEngine/reportEngine.tpl.html'
      }
    },
    data:{ pageTitle: 'Report Engine' }
  });
})

.controller( 'ReportEngineCtrl', function ReportEngineCtrl( $scope, dataServices,$http,$timeout) {

  // Declaracion de variables

  $scope.showNewForm = false;
  $scope.showEditForm = false;

  // Declaracion de funciones

  //Lista de ReportEngines
  $scope.getReportEngines = function () {
    $scope.loading = true;
    dataServices.getReportEngines().success(function (data) {
    $scope.data = data;
    $scope.loading = false;
    });
  };

  //Función para guardar
  $scope.save = function () {

    var data= {};
    data=$scope.form;

    $http({
      url: serverURL + 'reportengines',
      data: angular.toJson(data),
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).success(function (data) {
      $scope.successMsg = 1;
      $scope.errorMsg = 0;
      $scope.showNewForm = false;
      $timeout(function () {
        $scope.successMsg = 0;
      }, 3000);
      $scope.getReportEngines();
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
      url: serverURL + 'reportengines/'+data.id,
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
      $scope.getReportEngines();
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
      url: serverURL + 'reportengines/'+id,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).success(function (data) {
      $scope.successMsg = 1;
      $scope.errorMsg = 0;
      $timeout(function () {
        $scope.successMsg = 0;
      }, 3000);
      $scope.getReportEngines();
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
    dataServices.getReportEngineById(id).success(function (data) {
      $scope.dataFormEdit = data;
      $scope.dataFormEdit.object_id = data.id;
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

})

;
