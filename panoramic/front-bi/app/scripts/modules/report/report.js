angular.module( 'app.report', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'report', {
    url: '/report',
    views: {
      "main": {
        controller: 'ReportCtrl',
        templateUrl: 'scripts/modules/report/report.tpl.html'
      }
    },
    data:{ pageTitle: 'Reportes' }
  });
})

.controller( 'ReportCtrl', function ReportCtrl( $scope ) {


})

;
