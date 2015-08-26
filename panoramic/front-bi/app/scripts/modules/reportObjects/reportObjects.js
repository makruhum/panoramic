angular.module( 'app.reportObjects', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'reportObjects', {
    url: '/reportObjects',
    views: {
      "main": {
        controller: 'ReportObjectsCtrl',
        templateUrl: 'scripts/modules/reportObjects/reportObjects.tpl.html'
      }
    },
    data:{ pageTitle: 'Report Objects' }
  });
})

.controller( 'ReportObjectsCtrl', function ReportObjectsCtrl( $scope, dataServices,$http,$timeout) {
  // Declaracion de variables

  $scope.showNewForm = false;
  $scope.showEditForm = false;
  $scope.arrayObjectsParams=[];
  $scope.dynamicForm=[];

  $scope.typeParamsListSelected={};
  $scope.objectParamSelected='';
  // Conifiguracion del la grafica
  $scope.chartConfig = {};

  // Declaracion de funciones

  //Lista de Objects
    $scope.getObjects = function () {
        $scope.loading = true;
        dataServices.getObjects().success(function (data) {
            $scope.objectList = data;
            $scope.loading = false;
        });
    };

      //Lista de ReportTypes
    $scope.getReportTypes = function () {
        $scope.loading = true;
        dataServices.getReportTypes().success(function (data) {
            $scope.reportTypesList = data;
            $scope.loading = false;
        });
    };

// pushObjectParams
$scope.pushObjectParams = function () {
   $scope.arrayObjectsParams.push({column:$scope.objectParamSelected,reports_params_id:$scope.typeParamsListSelected.id,reports_params_name:$scope.typeParamsListSelected.param_name});
   $scope.typeParamsListSelected={};
   $scope.objectParamSelected="";
};
// pushObjectParams
$scope.pushDataForm = function (param_data,objec_param,index) {
 
  if ($scope.dataForm===undefined){
    $scope.dataForm=[];
     console.log ("undefined");
     console.log (param_data.id);
     console.log (objec_param);
     console.log (index);
      $scope.dataForm.push({column:objec_param,
                            reports_params_id:param_data.id,
                            reports_params_name:param_data.param_name});
  }
  else{

       if ($scope.dataForm[index]===undefined){
         $scope.dataForm.push({column:objec_param,
                            reports_params_id:param_data.id,
                            reports_params_name:param_data.param_name});
       }else{
          
          if ( objec_param==null) {
          $scope.dataForm[index].column=null;
          $scope.dataForm[index].reports_params_id=null;
          $scope.dataForm[index].reports_params_name=null;

          } else{
          $scope.dataForm[index].column=objec_param;
          $scope.dataForm[index].reports_params_id=param_data.id;
          $scope.dataForm[index].reports_params_name=param_data.param_name;
          }
          // hablate con el caballo
          
       } 

           // ---Validacionn
    console.log("********************************************************");
    var aux;
    var cont=0;
    for (var i = 0; i <  $scope.dataForm.length; i++) {
       console.log("- - - - ");
        aux= $scope.dataForm[i].column;
        for (var j = 0; j < $scope.dataForm.length; j++) {
            if ($scope.dataForm[j].column==aux) {
                 console.log($scope.dataForm[j].column+"---"+aux+"*****");
                 cont=cont+1;
            } 
              else{
                console.log($scope.dataForm[j].column+"---"+aux);
              }
           
        }

       console.log(aux+":"+cont);
      
       if (cont>1){
          console.log("***No es valido***");
        }
        cont=0;
    }
    //--------------
  }
};

      //Lista de Objects Reports
    $scope.getObjectsReports = function () {
        $scope.loading = true;
        dataServices.getObjectsReports().success(function (data) {
            $scope.data = data;
            $scope.loading = false;
        });
    };

    //Lista de getColumns
    $scope.getColumns = function (id) {
      console.log ("id:"+id);
		//var data= {};
    if (id===undefined) {
     return;
     }		
     //data.query=query;
		$http({
            url: serverURL +'objects/getColumns/'+id,
          //  data: angular.toJson(data),
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
           $scope.objectParamsList = data;
            $scope.db.items = data.data;
          //  $scope.db.items = []; 
          
            if(!$scope.$$phase) {
                $scope.db.items = data.data;
            $scope.$apply();
            }
        }).error(function (err) {
            
            alert("Error");
        });
    };

    //Lista de getColumns
    $scope.getParams = function (id) {
		$http({
            url: serverURL +'reporttypes/'+id,
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
           $scope.typeParamsList = data.params;
            $scope.dynamicForm = data.params;
        }).error(function (err) {
            
            alert("Error");
        });
    };

    //Lista de getCharts
    $scope.getChart= function (alias,row) {
     var data = {};
     console.log (alias);
     console.log (row);
     data.query=row.objects_id.query;
     data.title=row.name;
    $http({
            url: serverURL +alias+'/buildReport',
            method: 'POST',
            data: angular.toJson(data),
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
           $scope.chartConfig = data.report;

        }).error(function (err) {
            
            alert("Error");
        });
    };

        //Lista de getCharts
    $scope.getChartbyId= function (row) {
    // var data = {};
     console.log (row.id);
    // data.query=row.objects_id.query;
   //  data.title=row.name;
    $http({
            url: serverURL +'objectsreports/'+row.id,
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
           $scope.chartConfig =  data;
           console.log ( $scope.chartConfig);
        }).error(function (err) {
            alert("Error");
        });
    };




 //Función para guardar
    $scope.save = function () {
      console.log ("----Guardando el reporte");
      var data= {};
      data=$scope.form;
      //data.params = [];

      data.reportsparamsobjects=$scope.dataForm;
      console.log ($scope.dataForm);
      $http({
            url: serverURL + 'objectsreports',
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
            $scope.getObjectsReports();
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
            url: serverURL + 'objectsreports/'+data.id,
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
            $scope.getObjectsReports ();
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
            url: serverURL + 'objectsreports/'+id,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).success(function (data) {
            $scope.successMsg = 1;
            $scope.errorMsg = 0;
            $timeout(function () {
                $scope.successMsg = 0;
            }, 3000);
            $scope.getObjectsReports ();
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
          dataServices.getObjectsReportsById(id).success(function (data) {
          $scope.dataFormEdit = data;
          $scope.dataFormEdit.report_engines_id = data.id;
          $scope.dataFormEdit.report_types_id = data.report_types_id.id;
          $scope.dataFormEdit.objects_id = data.objects_id.id;
          
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
        $scope.form.description='';
        $scope.form.objects_id='';
        $scope.form.report_types_id='';    
        $scope.dataForm=[];
        $scope.dataForm=undefined;
     };

    // Clear params
     $scope.clearParams = function () {
        $scope.dataForm=[];
        $scope.dataForm=undefined;
     };
var products = [
          {
            "description": "Big Mac",
            "options": [
              {"description": "Big Mac", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
              {"description": "Big Mac & Co", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
              {"description": "McRoyal", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
              {"description": "Hamburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
              {"description": "Cheeseburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
              {"description": "Double Cheeseburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null}
            ]
          },
          {
            "description": "Fried Potatoes",
            "options": [
              {"description": "Fried Potatoes", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null},
              {"description": "Fried Onions", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null}
            ]
          }
        ];
     var firstNames = ["Ted", "John", "Macy", "Rob", "Gwen", "Fiona", "Mario", "Ben", "Kate", "Kevin", "Thomas", "Frank"];
        var lastNames = ["Tired", "Johnson", "Moore", "Rocket", "Goodman", "Farewell", "Manson", "Bentley", "Kowalski", "Schmidt", "Tucker", "Fancy"];
        var address = ["Turkey", "Japan", "Michigan", "Russia", "Greece", "France", "USA", "Germany", "Sweden", "Denmark", "Poland", "Belgium"];

        $scope.minSpareRows = 1;
        $scope.colHeaders = true;

$scope.db ={};
$scope.db.items=[];


        $scope.db = {};
        $scope.db.items = [];
        for (var i = 0; i < 10; i++) {
          $scope.db.items.push(
            {
              perc: i + 1,
              linea:1
            });
        }

       /* $scope.db.dynamicColumns = [
          {
            data: 'perc',
            title: 'perc'
          },
          {
            data: 'linea',
            title: 'linea'
          }
        ]; */


});
