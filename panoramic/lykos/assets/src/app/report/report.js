angular.module( 'ngBoilerplate.report', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'report', {
    url: '/report',
    views: {
      "main": {
        controller: 'ReportCtrl',
        templateUrl: 'report/report.tpl.html'
      }
    },
    data:{ pageTitle: 'Reportes' }
  });
})

.controller( 'ReportCtrl', function ReportCtrl( $scope ) {


})

;
