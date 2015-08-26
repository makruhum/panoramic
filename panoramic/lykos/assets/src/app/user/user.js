angular.module( 'ngBoilerplate.user', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'user', {
    url: '/user',
    views: {
      "main": {
        controller: 'UserCtrl',
        templateUrl: 'user/user.tpl.html'
      }
    },
    data:{ pageTitle: 'Users' }
  });
})
.controller( 'UserCtrl', function UserCtrl( $scope, dataServices,$http,$timeout) {

  
});
