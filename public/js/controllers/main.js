angular.module('todoController', [])
  .controller('mainController', ['$scope', '$http', 'Todos', function($scope, $http, Todos) {
    $scope.formData = {};
    $scope.error = null;

    function loadItems() {
      $scope.loading = true;
      Todos.get()
        .success(function(data) {
          $scope.formData = {};
          $scope.todos = data;
          $scope.loading = false;
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
        });
    };
  }]);
