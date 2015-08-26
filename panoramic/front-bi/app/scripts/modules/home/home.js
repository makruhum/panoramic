/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'app.home', [
    'ui.router',
  'ui.bootstrap',
  'highcharts-ng'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'scripts/modules/home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController( $scope,$http ) {


  $scope.getValue = function (id,index) {
    
    var data= {};
    data.id=id;
    data.index=index;
    $http({
      url: serverURL + 'kpi/getAllKpiWithValue/'+id,
    
        method: "POST",
        data: { 'data' : data },
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).success(function (data) {
      console.log($scope.dataset);
    $scope.dataset[data.data.index].resultValue={};
    $scope.dataset[data.data.index].resultValue=data.value;
     // $scope.dataset[id].resultValue=data.value;

    }).error(function (err) {

    });

  };

$scope.getInitData = function () {
  $http.get(serverURL + 'kpi/getAllKpi/')
   .success(function  (data) {
    $scope.dataset = data.data;
      console.log (data.data);

      for (var i = 0; i <  $scope.dataset.length; i++) {
           $scope.getValue($scope.dataset[i].objects_id,i);
      };

   })

};
  
 $scope.dataDash = [];
 $scope.typeChart = ['line','bar']; 
 var index=0;
  for (var i = 1; i <= 3; i++) {
      if (index===0) {
        index=1;
      }else{
        index=0;
      }
  console.log(index);
  var chartNG = {
        options: {
            chart: {
                type:  $scope.typeChart[index]
            }
        },
        series: [{
            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1,Math.floor(Math.random() * 20) + 1]
        },{
            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1]
        },{
            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1]
        }],
        title: {
            text: null
        },
        size: {
        height: 280
        },
        loading: false
    };

   $scope.dataDash.push( {name: 'Dashboard '+i, description:'description resumen en la configuracion'+i, idChart:i,chart:chartNG});
  }

$scope.loader = function (value) {


      $scope.dataDash[value].chart.loading=true;
      $scope.dataDash[value].chart.series=[];
      console.log('cargando data:'+value);
      $timeout(function() {

      console.log('cargando data value:'+value);

      $scope.dataDash[value].chart.series=[
      {
      data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1,Math.floor(Math.random() * 20) + 1]
      },{
      data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1]
      },{
      data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1]
      }];

      console.log('cambiando:'+value);
      $scope.dataDash[value].chart.loading=false;
      }, 3000);
 };
  //---- Grafica
   $scope.addPoints = function () {
        var seriesArray = $scope.highchartsNG.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20]);
    };

    $scope.addSeries = function () {
        var rnd = [];
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1);
        }
        $scope.highchartsNG.series.push({
            data: rnd
        });
    };

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.highchartsNG.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1);
    };

    $scope.options = {
        type: 'line'
    };

    $scope.swapChartType = function () {
        if (this.highchartsNG.options.chart.type === 'line') {
            this.highchartsNG.options.chart.type = 'bar';
        } else {
            this.highchartsNG.options.chart.type = 'line';
        }
    };
   
///--------------------------------------------------------------

$scope.chartNG = {
        options: {
            chart: {
                type:  'line'
            }
        },
        series: [{
            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1,Math.floor(Math.random() * 20) + 1]
        },{
            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1]
        },{
            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1]
        }],
        title: {
            text: null
        },
        size: {
        height: 280
        },
        loading: false
    };

});
