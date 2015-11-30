angular.module('todoController', [])
  .controller('mainController', ['$scope', '$http', 'Todos', function($scope, $http, Todos) {
    $scope.formData = {};
    $scope.error = null;
    $scope.orderBy = {
      'sort': 'text',
      'order': -1
    };

    function loadItems() {
      $scope.loading = true;
      Todos.get($scope.orderBy)
        .success(function(data) {
          $scope.formData = {};
          $scope.todos = data;
          $scope.loading = false;
          $scope.removeError();
        });
    }

    loadItems();

    function reportError(err) {
      $scope.loading = false;
      $scope.error = err.message;
    }

    $scope.createTodo = function() {
      if ($scope.formData.text != undefined) {
        $scope.loading = true;

        Todos.create($scope.formData)
          .success(loadItems)
          .error(reportError)
      }
    };

    $scope.deleteTodo = function(id) {
      $scope.loading = true;

      Todos.delete(id)
        .success(function(data) {
          $scope.loading = false;
          $scope.todos = data;
          $scope.removeError();
        });
    };

    $scope.removeError = function() {
      $scope.error = null;
    }

    $scope.$watch('orderBy.order', function( newVal, oldVal ){
      if(newVal) {
        $scope.orderBy.sort = 'text';
        loadItems();
      }
    });
  }]);
