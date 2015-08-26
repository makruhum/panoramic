'use strict';

/**
 * @ngdoc overview
 * @name App
 * @description
 * # App
 *
 * Main module of the application.
 */


var serverURL = 'http://localhost:1337/';


angular
    .module('app', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'app.home',
    'app.user',
    'app.config',
    'app.report',
    'app.managers',
    'app.objects',
    'app.reportEngine',
    'app.reportTypes',
    'app.reportParamsObjects',
    'app.reportsParams',
    'app.reportObjects',
    'app.table',
    'app.dashboard',
    'app.auth',
    'app.actions', 
    'app.wizard',
    'app.role',
    'app.modules',
    'app.permission',
    'app.connections',
    'app.kpi',
    'angular-storage'

])

//Factoria para la obtención de data general para todas los controladores
    .factory('dataServices', function ($http, $q) {
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

        //Retorna un  Actions
        getActions: function (val) {
            return $http.get(serverURL + 'actions/');
        },
        //Retorna listado de ReportEngines
        getActionById: function (val) {
            return $http.get(serverURL + 'actions/'+val);
        } ,
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
        },
        //Retorna la lista de roles
        getRoles: function () {
            return $http.get(serverURL + 'role');
        },
        //Retorna un Tipo de parametros de reportes segun el ID
        getRoleById: function (val) {
            return $http.get(serverURL + 'role/'+val);
        },
        //Retorna la lista de Tipos de parametros de reportes
        getModules: function () {
            return $http.get(serverURL + 'modules');
        },
        //Retorna un Tipo de parametros de reportes segun el ID
        getModuleById: function (val) {
            return $http.get(serverURL + 'modules/'+val);
        },
        getUsers: function () {
            return $http.get(serverURL + 'user');
        },
        //Retorna un Tipo de parametros de reportes segun el ID
        getUserById: function (val) {
            return $http.get(serverURL + 'user/'+val);
        },
        getPermissions: function () {
            return $http.get(serverURL + 'permission');
        },
        //Retorna un Tipo de parametros de reportes segun el ID
        getPermissionById: function (val) {
            return $http.get(serverURL + 'permission/'+val);
        },

        //servicios para autenticacion
        
        login: function(credentials){
            return   $http
                .post( serverURL + 'auth/login', credentials)
                .then(function(response) {
                //delete(response.data.auth.password);
                console.log(response);
                return response;
            })
            ;
        },
        logout: function(){
            return $http.get(serverURL + 'auth/logout');

        },
    };
})
    .config(function ($httpProvider,$routeProvider,$urlRouterProvider) {
    $httpProvider.defaults.withCredentials = true;
    $urlRouterProvider.otherwise( '/home' );
    $httpProvider.interceptors.push('APIInterceptor');
})
    .service('UserService', function(store){
    //agregado para almacenar usuario en dataStore

    var service = this;
    var currentUser = null;

    service.setCurrentUser = function(user) {
        currentUser = user;
        store.set('user', user);
        return currentUser;
    };

    service.getCurrentUser = function() {
        if (!currentUser) {
            currentUser = store.get('user');
        }
        return currentUser;
    };
})
    .service('APIInterceptor', function($rootScope, UserService) {
    var service = this;

    service.request = function(config) {
        var currentUser = UserService.getCurrentUser();
        //var access_token = currentUser ? currentUser.access_token : null;
        //console.log("access_token");
        //console.log(access_token);
        /*if (access_token) {
            config.headers.authorization = access_token;
        }*/
        return config;
    };

    service.responseError = function(response) {
        //401 ya que el forbidden que retorna el sails es ese numero
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }if(response.status === 403){
            console.log("No tiene permiso a la accion");
        }
        return response;
    };
})
    .controller( 'AppCtrl', function AppCtrl ( $scope, UserService, dataServices, $rootScope, $state) {
    $scope.showLogin=false;
    //funcion para cerrar session

    $scope.logout = function(){
        dataServices.logout().then(function(response){
            $scope.currentUser= UserService.setCurrentUser(null);
            $state.go('auth');
        }, function(error){
            console.log(error);
        }
                                  );
    };
    $rootScope.$on('authorized', function() {
        console.log("on authorized");
        $scope.currentUser = UserService.getCurrentUser();
        $rootScope.currentUser = UserService.getCurrentUser();
        console.log($scope.currentUser);
    });

    $rootScope.$on('unauthorized', function() {
        console.log("on unauthorized");
        $scope.currentUser = UserService.setCurrentUser(null);
        $rootScope.currentUser = UserService.setCurrentUser(null);
        $state.go('auth');
    });

    //$scope.main.logout = logout;
    $scope.currentUser = UserService.getCurrentUser();
    $rootScope.currentUser = UserService.getCurrentUser();

    //**********************

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if ( angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = toState.data.pageTitle + ' | Lykos' ;
        }
    });


    $scope.Menu = [];

        $scope.Menu = [
   
        {
            'name': ' Inicio',
            'route': '#',
            'id': '1',
            'active': true,
            'icon': 'fa fa-dashboard',
            'SubMenu': [{
                'name': 'KPI',
                'route': 'kpi',
                'id': '1',
                'active': true,
                'icon': 'fa fa-tachometer'
            },{
                'name': 'Tabla Pivote',
                'route': 'table',
                'id': '1',
                'active': true,
                'icon': 'fa fa-table'
            },{
                'name': 'Dashboard',
                'route': 'dashboard',
                'id': '1',
                'active': true,
                'icon': 'fa fa-pie-chart'
            }]

        },
        {
            'name': 'Configuracion',
            'route': '#',
            'id': '1',
            'active': true,
            'icon': 'fa fa-gear',
            'SubMenu': [{
                'name': 'Managers',
                'route': 'managers',
                'id': '1',
                'active': true,
                'icon': 'fa fa-gears'
            },{
                'name': 'Conexiónes',
                'route': 'connections',
                'id': '1',
                'active': true,
                'icon': 'fa fa-gears'
            },{
                'name': 'Objectos',
                'route': 'objects',
                'id': '1',
                'active': true,
                'icon': 'fa fa-gears'
            },{
                'name': 'Report Engine',
                'route': 'config',
                'id': '1',
                'active': true,
                'icon': 'fa fa-gears'
            },{
                'name': 'Report Types',
                'route': 'config',
                'id': '1',
                'active': true,
                'icon': 'fa fa-gears'
            },{
                'name': 'Report Objects',
                'route': 'config',
                'id': '1',
                'active': true,
                'icon': 'fa fa-gears'
            },{
                'name': 'Report Params',
                'route': 'config',
                'id': '1',
                'active': true,
                'icon': 'fa fa-gears'
            },{
                'name': 'Report Params Objects',
                'route': 'config',
                'id': '1',
                'active': true,
                'icon': 'fa fa-gears'
            }]

        },
        {'name': 'Permisologia',
         'route': '#',
         'id': '1',
         'active': true,
         'icon': 'fa fa-shield',
         'SubMenu': [{
                'name': 'Roles',
                'route': 'role',
                'id': '1',
                'active': true,
                'icon': 'fa fa-circle-o'
            },{
                'name': 'Usuarios',
                'route': 'user',
                'id': '1',
                'active': true,
                'icon': 'fa fa-users'
            },{
                'name': 'Modulos',
                'route': 'modules',
                'id': '1',
                'active': true,
                'icon': 'fa fa-cubes'
            },{
                'name': 'Acciones',
                'route': 'actions',
                'id': '1',
                'active': true,
                'icon': 'fa fa-crosshairs'
            },{
                'name': 'Permisos',
                'route': 'permission',
                'id': '1',
                'active': true,
                'icon': 'fa fa-unlock-alt'
            }
                    ]

        }

    ];


});
