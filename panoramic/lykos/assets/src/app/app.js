
var serverURL = 'http://localhost:1337/';


angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.config',
  'ngBoilerplate.report',
  'ngBoilerplate.managers',
  'ngBoilerplate.connections',
  'ngBoilerplate.objects',
  'ngBoilerplate.reportEngine',
  'ngBoilerplate.reportTypes',
  'ngBoilerplate.reportParamsObjects',
  'ngBoilerplate.reportsParams',
  'ngBoilerplate.reportObjects',
  'ngBoilerplate.user',
  'ngBoilerplate.table',
  'ui.router',
  'highcharts-ng',
  'ngHandsontable',
  'ngDragDrop',
  'LocalStorageModule'
  ])



.config( function myAppConfig ( $stateProvider, $urlRouterProvider, localStorageServiceProvider) {
  $urlRouterProvider.otherwise( '/home' );
  localStorageServiceProvider
  .setStorageType('localStorage')
  .setNotify(true, true);
})

.run( function run () {
})
//Factoria para la obtención de data general para todas los controladores
.factory('dataServices', function ($http) {
  return {
        //Retorna la lista de Managers registrados
        getManagers: function () {
          return $http.get(serverURL + 'managers');
        },
       //Retorna un  Manager por ID registrado
       getManagerById: function (val) {
        return $http.get(serverURL + 'managers/'+val);
      },
          //Retorna la lista de Connections registrados
          getConnections: function () {
            return $http.get(serverURL + 'connection');
          },
        //Retorna un  Connection
        getConnectionById: function (val) {
          return $http.get(serverURL + 'connection/'+val);
        },
          //Retorna la lista de Objects registrados
          getObjects: function () {
            return $http.get(serverURL + 'objects');
          },
        //Retorna un  Objeto
        getObjectById: function (val) {
          return $http.get(serverURL + 'objects/'+val);
        },
        //Retorna listado de ReportEngines
        getReportEngines: function () {
          return $http.get(serverURL + 'reportengines');
        },
        //Retorna listado de ReportEngines
        getReportEngineById: function (val) {
          return $http.get(serverURL + 'reportengines/'+val);
        } ,
           //Retorna la lista de Tipos de Reportes
           getReportTypes: function () {
            return $http.get(serverURL + 'reporttypes');
          },
        //Retorna un Tipo de Reporte segun el ID
        getReportTypesById: function (val) {
          return $http.get(serverURL + 'reporttypes/'+val);
        },
        //Retorna un listado de los Objects Reports
        getObjectsReports: function () {
          return $http.get(serverURL + 'objectsreports');
        },
        //Retorna un ObjectReport segun el ID
        getObjectsReportsById: function (val) {
          return $http.get(serverURL + 'objectsreports/'+val);
        },
           //Retorna la lista de Tipos de parametros de reportes
           getReporstParams: function () {
            return $http.get(serverURL + 'reportsparams');
          },
        //Retorna un Tipo de parametros de reportes segun el ID
        getReportsParamsById: function (val) {
          return $http.get(serverURL + 'reportsparams/'+val);
        }


      };
    })

.directive('jsonText', function() {
  return {
   priority: -1,
   restrict: 'A',
   link: function(scope, element, attrs){
     element.bind('click', function(e){
       var message = attrs.ngConfirmClick;
       if(message && !confirm(message)){
         e.stopImmediatePropagation();
         e.preventDefault();
       }
     });
   }
 };
})
.directive('ngConfirmClick', function() {
  return {
   priority: -1,
   restrict: 'A',
   link: function(scope, element, attrs){
     element.bind('click', function(e){
       var message = attrs.ngConfirmClick;
       if(message && !confirm(message)){
         e.stopImmediatePropagation();
         e.preventDefault();
       }
     });
   }
 };
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  
  $scope.Menu = [];
  
  $scope.Menu = [
  {
    "name": "Reportes",
    "route": "report",
    "id": "1",
    "active": true,
    "icon": "fa fa-bars"
  },
  {
    "name": "Configuracion",
    "route": "config",
    "id": "1",
    "active": true,
    "icon": "fa fa-gear",
    "SubMenu": [
    {
      "name": "Ajustes Basicos",
      "route": "config",
      "id": "1",
      "active": true,
      "icon": "fa fa-gears",
      "SubMenu": [
      {
        "name": "Managers",
        "route": "config",
        "id": "1",
        "active": true,
        "icon": "fa fa-gears"
      },
      {
        "name": "Conexiones",
        "route": "config",
        "id": "1",
        "active": true,
        "icon": "fa fa-gears"
      },
      {
        "name": "Schemas",
        "route": "config",
        "id": "1",
        "active": true,
        "icon": "fa fa-gears"
      },
      {
        "name": "Columns",
        "route": "config",
        "id": "1",
        "active": true,
        "icon": "fa fa-gears"
      },
      {
        "name": "Query",
        "route": "config",
        "id": "1",
        "active": true,
        "icon": "fa fa-gears"
      }
      ]
    },
    {
      "name": "Seguridad",
      "route": "config",
      "id": "1",
      "active": true,
      "icon": "fa fa-gears",
      "Menu": [ {
        "name": "Usuarios",
        "route": "config",
        "id": "1",
        "active": true,
        "icon": "fa fa-gears"
      },{
        "name": "Roles",
        "route": "config",
        "id": "1",
        "active": true,
        "icon": "fa fa-gears"
      },{
        "name": "Reportes vs Roles",
        "route": "config",
        "id": "1",
        "active": true,
        "icon": "fa fa-gears"
      }]
    }
    ]
  }
  ];
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Lykos' ;
    }
  });
})

;

