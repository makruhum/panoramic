'use strict';
angular.module( 'app.auth', [
    'ui.router',
    'ui.bootstrap'
]).config(function ( $httpProvider,$stateProvider,$urlRouterProvider) {

    $stateProvider.state( 'auth', {
        url: '/auth',
        views: {
            "main": {
                controller: 'LoginController',
                templateUrl: 'scripts/modules/auth/auth.tpl.html'
            }
        },
        data:{ pageTitle: 'Autenticacion' }
    });

})

    .controller('LoginController',  function(dataServices,$scope, $state, /*Auth,*/ $http, $rootScope, UserService) {

    $scope.formData = {
        email: '',
        password: ''
    };

    $scope.login = function() {
        var user={};
        if ( $scope.loginForm.$valid ) {
            dataServices.login($scope.formData).then(function(response){
                user=response.data;
                UserService.setCurrentUser(response.data);
                $rootScope.$broadcast('authorized');
                $state.go('home');
            });
        }
    };

    $scope.logout = function(){
        dataServices.logout().then(function(response){
            console.log(response);
        });
    };

    $scope.test = function (){
        $http({
            url: serverURL + 'user',
            method: 'GET'
        }).success(function (data) {
            $scope.dataTest = angular.toJson(data);
        }).error(function (err) {

        });
    };
});
