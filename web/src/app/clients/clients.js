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
angular.module( 'NewsRoomMananger_POC.clients', [
  'ui.router',
  'plusOne'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'clients', {
    url: '/clients',
    views: {
      "main": {
        templateUrl: 'clients/base.tpl.html'
      }
    },
    data:{ pageTitle: 'Client list' }
  })
  .state( 'clients.list', {
    url: '/list',
    views: {
      "content": {
        controller: 'ClientListCtrl',
        templateUrl: 'clients/list.tpl.html'
      }
    },
    data:{ pageTitle: 'Client list' }
  })
  .state( 'clients.edit', {
    url: '/{id:int}',
    views: {
      "content": {
        controller: 'ClientEditCtrl',
        templateUrl: 'clients/form.tpl.html'
      }
    },
    data:{ pageTitle: 'Client edit' }
  })
  .state( 'clients.new', {
    url: '/new',
    views: {
      "content": {
        controller: 'ClientEditCtrl',
        templateUrl: 'clients/form.tpl.html'
      }
    },
    data:{ pageTitle: 'New client' }
  });

})

/**
 * And of course we define a controller for our route.
 */
.controller( 'ClientListCtrl', function ( $scope, Restangular ) {
  // TODO: Add a spinner while we load from the api
  $scope.clients = Restangular.all('client').getList().$object;
  $scope.remove = function(id, index) {
    Restangular.one('client', id).remove().then(function() {
      $scope.clients.splice(index, 1);
      console.log("Object deleted OK");
    }, function() {
      console.log("There was an error deleting");
    });
  };
})

.controller( 'ClientEditCtrl', function ( $scope, $state, $stateParams, Restangular ) {
  $scope.showSpinner = false;
  if ($stateParams.id) {
    $scope.showSpinner = true;
    Restangular.one('client', $stateParams.id).get().then(function(result) {
      $scope.client = result;
      $scope.showSpinner = false;
    });
  }

  $scope.save = function(client) {
    if ($stateParams.id) {
      d = $scope.client.save();
    } else {
      d = Restangular.service('client').post($scope.client);
    }
    d.then(function(obj) {
      console.log("Object saved OK");
      $state.go("clients.list");
    }, function() {
      console.log("There was an error saving");
    });
  };
});