angular.module( 'app.config', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'config', {
    url: '/config',
    views: {
      "main": {
        controller: 'ConfigCtrl',
        templateUrl: 'scripts/modules/config/config.tpl.html'
      }
    },
    data:{ pageTitle: 'Configuracion' }
  });
})

.controller( 'ConfigCtrl', function ConfigCtrl( $scope ) {


})

;
