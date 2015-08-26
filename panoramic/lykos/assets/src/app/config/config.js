angular.module( 'ngBoilerplate.config', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'config', {
    url: '/config',
    views: {
      "main": {
        controller: 'ConfigCtrl',
        templateUrl: 'config/config.tpl.html'
      }
    },
    data:{ pageTitle: 'Configuracion' }
  });
})

.controller( 'ConfigCtrl', function ConfigCtrl( $scope ) {


})

;
