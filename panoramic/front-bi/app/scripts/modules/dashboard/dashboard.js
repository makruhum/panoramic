angular.module( 'app.dashboard', [
  'ui.router',
  'ui.bootstrap',
  'highcharts-ng'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'dashboard', {
    url: '/dashboard',
    views: {
      "main": {
        controller: 'DashboardCtrl',
        templateUrl: 'scripts/modules/dashboard/dashboard.tpl.html'
      }
    },
    data:{ pageTitle: 'Dashboard' }
  });
})
.controller( 'DashboardCtrl', function TableCtrl( $scope,$timeout) {



 $scope.dataDash = [];
 $scope.typeChart = ['line','bar']; 
 var index=0;
  for (var i = 1; i <= 12; i++) {
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
            },
             exporting: {
                enabled: false

               },
        },

        exporting: {
            enabled: false

        },
        series: [{

            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1,Math.floor(Math.random() * 20) + 1],
            showInLegend: false
          },{
            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1],
            showInLegend: false
        },{
            data: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1],
            showInLegend: false
        }],
        title: {
            text: null
        },
        credits: {
            enabled: false
        },
        size: {
        height: 140
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
   
});
