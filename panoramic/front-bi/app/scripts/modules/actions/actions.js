angular.module( 'app.actions', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider, $httpProvider) {

  //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  //  $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
  // $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
  //$httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
  // $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
 // $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
 // $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
  //$httpProvider.defaults.headers.post['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE';
  //$httpProvider.defaults.headers.post['Access-Control-Allow-Credentials'] = true;
 // $httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = '*';


    //console.log($httpProvider.defaults);
    //$httpProvider.defaults.useXDomain = true;


  $stateProvider.state( 'actions', {
    url: '/actions',
    views: {
      "main": {
        controller: 'ActionsCtrl',
        templateUrl: 'scripts/modules/actions/actions.tpl.html',
        //headers:{'Content-Type':'application/json'}
      }
    },
    data:{ pageTitle: 'Actions ' }
  });
})

.controller( 'ActionsCtrl', function ActionsCtrl( $scope, dataServices,$http,$timeout) {
  // Declaracion de variables
  
  $scope.showNewForm = false;
  $scope.showEditForm = false;
  
  // Declaracion de funciones

  //Lista de actions
    $scope.getActions = function () {
        $scope.loading = true;
      

       $http({
            url: serverURL + 'actions',
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
            url: serverURL + 'actions',
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
      data=$scope.dataFormEdit;

       $http({
            url: serverURL + 'actions/'+data.id,
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
            $scope.getActions ();
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
            url: serverURL + 'actions/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getActions ();
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
          dataServices.getActionById(id).success(function (data) {

              $scope.dataFormEdit = data;

              $scope.dataFormEdit.actions_id = data.id;
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
        $scope.form.adapter='';
        $scope.form.description='';
        $scope.form.name='';
     };


});