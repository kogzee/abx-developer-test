angular.module('todoController', [])
  .controller('mainController', ['$scope', '$http', 'Todos', function ($scope, $http, Todos) {
    $scope.formData = {};
    $scope.loading = true;
    $scope.submitted = false;
    $scope.sortReverse = false;
    $scope.errorMessage = '';

    Todos.get()
      .success(function (data) {
        $scope.todos = data;
        $scope.loading = false;
      });

    $scope.createTodo = function () {
      $scope.submitted = true;
      $scope.errorMessage = '';
      $scope.todoForm.$setDirty();
      if ($scope.formData.text != undefined) {
        $scope.loading = true;

        Todos.create($scope.formData)
          .success(function (data) {
            $scope.loading = false;
            $scope.formData = {};
            $scope.todos = data;
            $scope.submitted = false;
            $scope.todoForm.$setPristine();
          })
          .error(function (err) {
            $scope.loading = false;
            if (err && err.message)
              $scope.errorMessage = err.message;
            else
              $scope.errorMessage = "Unexpected error";
          });
      }
    };

    $scope.deleteTodo = function (id) {
      $scope.loading = true;
      $scope.errorMessage = '';
      Todos.delete(id)
        .success(function (data) {
          $scope.loading = false;
          $scope.todos = data;
        });
    };
  }]);
