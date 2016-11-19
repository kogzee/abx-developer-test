angular.module('todoController', [])
  .controller('mainController', ['$scope', '$http', 'Todos', function($scope, $http, Todos) {
    $scope.formData = {};
    $scope.loading = true;
    $scope.submitted = false;

    Todos.get()
      .success(function(data) {
        $scope.todos = data;
        $scope.loading = false;
      });

    $scope.createTodo = function() {
      $scope.submitted = true;
      $scope.todoForm.$setDirty();
      if ($scope.formData.text != undefined) {
        $scope.loading = true;

        Todos.create($scope.formData)
          .success(function(data) {
            $scope.loading = false;
            $scope.formData = {};
            $scope.todos = data;
            $scope.submitted = false;
            $scope.todoForm.$setPristine();
          });
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
