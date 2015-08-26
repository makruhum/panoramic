angular.module( 'app.wizard', [
 

  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'LocalStorageModule'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'wizard', {
    url: '/wizard',
    views: {
      "main": {
        controller: 'WizardCtrl',
        templateUrl: 'scripts/modules/wizard/wizard.tpl.html'
      }
    },
    data:{ pageTitle: 'Wizard' }
  });
})
.directive('pivot', ['localStorageService', function(localStorageService) {
         
    return {
         restrict: 'EA',
        link: function(scope, elem, attributes){
        
             scope.$watch('dataTable' ,function (value){
                    var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers);
                    var conf=localStorageService.get('pivot');
                    if (conf==null){
                    conf={rows:[],cols:[]};

                    }

                    $(elem).pivotUI(value, {
                    renderers: renderers,
                    rendererName: "Table",
                    cols:conf.cols,
                    rows:conf.rows,
                    onRefresh: function (config) {
                    var config_copy = JSON.parse(JSON.stringify(config));
                          //delete some values which are functions
                          delete config_copy["aggregators"];
                          delete config_copy["renderers"];
                          delete config_copy["derivedAttributes"];
                          //delete some bulky default values
                          delete config_copy["rendererOptions"];
                          delete config_copy["localeStrings"];
                          localStorageService.set('pivot',config_copy);
                          scope.$apply();
                          
                        }
                    });
            });


        }
    };
}])

.controller( 'WizardCtrl', function TableCtrl(  $scope, $filter, dataServices,$http,$timeout, localStorageService,$modal, $log) {

 $scope.workflow=[];

 $scope.isEmpty= function(obj) {
    return Object.keys(obj).length === 0;
};

 $scope.workflow.push({icon:null, iconNumber:1 ,name: 'Sources' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:false,route:'dashboard'});
 $scope.setSources= function(id) {
  console.log (id);
  $scope.slider='source';
   $scope.workflow=[];  
      if(id=='source-db'){
          $scope.slider='db-conexiones';
      //$scope.workflow.push({icon:'fa fa-home',name: 'Home' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:true,route:'home'});
      $scope.workflow.push({wizard:'source',icon:null, iconNumber:1 ,name: 'Sources' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:true,route:'dashboard'});
      $scope.workflow.push({wizard:'db-conexiones',icon:null, iconNumber:2 ,name: 'Conexiones' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:false,route:'dashboard'});
      $scope.workflow.push({wizard:'db-query',icon:null, iconNumber:3 ,name: 'Consultas' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:false,route:'dashboard'});
      $scope.workflow.push({wizard:'db-data',icon:null, iconNumber:4 ,name: 'Data' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:false,route:'dashboard'});
      $scope.workflow.push({wizard:'dashboard',icon:'fa fa-bar-chart',name: 'Dashboard' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:false,route:'dashboard'});

      }else {
        $scope.slider='files';

      //$scope.workflow.push({icon:'fa fa-home',name: 'Home' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:true,route:'home'});
      $scope.workflow.push({wizard:'source',icon:null, iconNumber:1 ,name: 'Sources' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:true,route:'dashboard'});
      $scope.workflow.push({wizard:'files',icon:null, iconNumber:2 ,name: 'Archivos' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:false,route:'dashboard'});
      $scope.workflow.push({wizard:'file-data',icon:null, iconNumber:3 ,name: 'Data' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:false,route:'dashboard'});
      $scope.workflow.push({wizard:'dashboard',icon:'fa fa-bar-chart',name: 'Dashboard' ,activeClass:'badge label-success',inactiveClass:'badge label-default',isActive:false,route:'dashboard'});

  }

   
 };

  $scope.setWork= function(wizard) {

    console.log ("Enviado:"+wizard);
    $scope.slider=wizard;
    for (var i = 0; i <  $scope.workflow.length; i++) {
      $scope.workflow[i].isActive=true;
       if($scope.workflow[i].wizard==wizard){
        console.log ($scope.workflow[i].wizard+"  "+wizard );     
        console.log (i);  
        $scope.workflow[i].isActive=true;
        break;
       }
    };
  };



 $scope.config={};
 $scope.config.Connections={};
 $scope.config.Query={};
 $scope.config.Config={};

  $scope.selectConnection= function(row) {
      // Nota se deben filtrar las consultas por id de conexion
      if($scope.config.Connections===undefined) {
        return;
      }

      if($scope.config.Connections.id==row.id) {
        $scope.config.Connections={};
      } else {
         $scope.config.Connections=row;
      }

       
  };



  $scope.selectQuery= function(row) {
      // Nota se deben filtrar las consultas por id de conexion
      if($scope.config.Query===undefined) {
        return;
      }

      if($scope.config.Query.id==row.id) {
        $scope.config.Query={};
      } else {
         $scope.config.Query=row;
      }

       
  };





  function submit(key, val) {
   return localStorageService.set(key, val);
  }

    $scope.form={};
    $scope.rows = []; 
    $scope.cols = [];
    $scope.array = [];
    $scope.tableData =[];
    $scope.dataTable= [];
    $scope.tableRendered=[];
    $scope.fields = [];
    $scope.limit= {value:100};
    $scope.arrayLimit = [
      {value:10},
      {value:100},
      {value:1000},
      {value:10000},
      {value:'*'}
    ];
    var orderBy = $filter('orderBy');


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


  $scope.clearFilters = function () {
    $scope.rows = []; 
    $scope.cols = [];
  };

    //Lista de Objects
    $scope.getObjects = function () {
        $scope.loading = true;
        dataServices.getObjects().success(function (data) {
            $scope.objectList = data;
            $scope.loading = false;
        });
    };


  $scope.loadFile = function () {

    $http({
      url: serverURL + 'objects/loadFile',
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).success(function (data) {
      $scope.dataTable=data.data;

    }).error(function (err) {

    });

  };


  $scope.getFields = function () {

    $http({
      url: serverURL + 'objects/getColumns/'+$scope.form.objects_id+'?limit='+$scope.limit.value,
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).success(function (data) {
      
      // for (var i = 0; i < data.fields.length; i++) {
      //   $scope.fields.push(data.fields[i].title);
      // } 
     // console.log(data.data);
      $scope.dataTable=data.data;

    }).error(function (err) {

    });

  };

  //Función para getData
  $scope.getData = function () {

    $scope.rows=localStorageService.get('pivot').rows;
    $scope.columns=localStorageService.get('pivot').cols;
    var data = {};
    data.rows = $scope.rows;
    data.columns =  $scope.columns;
    data.id =  $scope.form.objects_id;

    $http({
      url: serverURL + 'objects/getColumns',
      method: 'POST',
      data: data,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).success(function (data) {


    // $scope.fields=data.fields;
    $scope.tableData = pivot(data.data, $scope.rows,  $scope.cols, {});
    $scope.array = [];
    $scope.categories=[];
      for (var i = 0; i < $scope.tableData.length; i++) {

            for (var j = 0; j < $scope.tableData[i].length; j++) {  

              if ($scope.tableData[i][j]!==undefined) {
                for (var k = 0; k < $scope.tableData[i][j].length; k++) {
                  if ($scope.tableData[i][j][k]!==null   ) {
                    $scope.array.push($scope.tableData[i][j][k]);                    
                  }
                  }
                }  
            }
      }
      submit('pivottable',$scope.array);
      for(var x=0; x<$scope.tableData.rowHeaders.length;x++) {
        for(var y=0; y<$scope.tableData.rowHeaders[x].length;y++) {
          if(y===0) {
            $scope.categories.push($scope.tableData.rowHeaders[x][y]);
          }
          else {
            $scope.categories[x]=$scope.categories[x]+" - "+$scope.tableData.rowHeaders[x][y];
          }
        }
      }
      submit('categories',$scope.categories);
  }).error(function (err) {}); 
  };

  
  $scope.getChart = function (chartType) {
    $scope.cols=localStorageService.get('pivot').cols;
    $scope.rows=localStorageService.get('pivot').rows;
    $scope.array=localStorageService.get('pivottable');
    $scope.categories=localStorageService.get('categories');
    $scope.sum=[]; $scope.metrics=[];
      for(var u=0; u<$scope.cols.length;u++) {
        var acum=0;
        for(var v=0; v<$scope.array.length;v++) {
          acum=acum+parseFloat($scope.array[v][$scope.cols[u]]);
          if(v===$scope.array.length-1) {
            $scope.sum.push({name:$scope.cols[u],avg:acum});
          }
        }
      }
      if(chartType==="column") {
        for(var p=0; p<$scope.cols.length;p++) {
          for(var q=0; q<$scope.array.length;q++) {
            if(q===0) {
              $scope.metrics.push({name:$scope.cols[p],data:[parseFloat($scope.array[q][$scope.cols[p]])]});
            }
            else {
              $scope.metrics[p].data.push(parseFloat($scope.array[q][$scope.cols[p]]));
            }
          }
        }
        $scope.chartConfig = {
          options:{
            chart:{type:'column',zoomType: 'xy',height: 800}
          },
          exporting: {
            enabled: true
          },
          xAxis:{categories:$scope.categories},
          plotOptions:{column:{dataLabels:{enabled:true}}},
          series:$scope.metrics,
          title:{text:'prueba'},
          subtitle:{text: 'subtitle'},
          loading: false,
          legend:{layout: 'vertical',align: 'right',verticalAlign: 'top'}
        };
      }
      if(chartType==="pie") {
        for(var w=0; w<$scope.cols.length;w++) {
          for(var z=0; z<$scope.array.length;z++) {
            if(z===0) {
              $scope.metrics.push({name:$scope.cols[w], data:[{name:$scope.categories[z],y:(parseFloat($scope.array[z][$scope.cols[w]])*100)/$scope.sum[w].avg}]});
            }
            else {
              $scope.metrics[w].data.push({name:$scope.categories[z],y:(parseFloat($scope.array[z][$scope.cols[w]])*100)/$scope.sum[w].avg});
            }
          }
        }
        $scope.chartConfig = {
          options:{
            chart:{type:"pie",height: 800}
          },
          exporting: {
            enabled: true,
            width: 1366,
            sourceWidth: 1366,
            sourceHeight: 800
          },
          plotOptions:{pie:{size:'100%'}},
          series: $scope.metrics
        };
      }
      if(chartType==="line") {
        for(var g=0; g<$scope.cols.length;g++) {
          for(var h=0; h<$scope.array.length;h++) {
            if(h===0) {
              $scope.metrics.push({name:$scope.cols[g],data:[parseFloat($scope.array[h][$scope.cols[g]])]});
            }
            else {
              $scope.metrics[g].data.push(parseFloat($scope.array[h][$scope.cols[g]]));
            }
          }
        }
        $scope.chartConfig = {
          options:{
            chart:{type:"line",zoomType: 'x',height: 800}
          },
          exporting: {
            enabled: true,
            width: 1366,
            sourceWidth: 1366,
            sourceHeight: 800
          },
          xAxis:{categories:$scope.categories},
          plotOptions:{line:{dataLabels:{enabled:true}}},
          series:$scope.metrics,
          title:{text:'prueba'},
          subtitle:{text: 'subtitle'},
          loading: false,
          legend:{layout: 'vertical',align: 'right',verticalAlign: 'top'}
        };
      }
  };

 //-----------------------------------Modals Views----------------------------------------


  $scope.animationsEnabled = true;


  $scope.openModalObjeto = function (size) {
    
    var modalInstance = $modal.open({
      animation: false, // Necesito arreglar esto.
      templateUrl: 'ListadoModal.html',
      controller: 'ModalObjects',
      size: size,
      resolve: {
        items: function () {
          return $scope.form;
        }
      }
    });

    modalInstance.result.then(function (value) {
      console.log ('result:');
       console.log (value);
       if (value=='cancel') return;
       $scope.form.objects_id = value.id;
       $scope.form.name = value.name;
       $scope.form.description = value.description;

        $scope.getFields();

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };  
})

.controller('ModalObjects', function ($scope, $modalInstance, items,dataServices,$http,$timeout) {
  $scope.loading = false;
  $scope.items = items;
  $scope.objectList = [];
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.seleccionar = function (row) {
    $modalInstance.close(row);
  };

  $scope.cancel = function () {
    $modalInstance.close('cancel');
  };

      //Lista de Objects
    $scope.getObjects = function () {
        $scope.loading = true;
        dataServices.getObjects().success(function (data) {
            $scope.objectList = data;
            $scope.loading = false;
        });
    };


});
