angular.module('todoService', [])
  .factory('Todos', ['$http', function($http) {
    return {
      get: function( params ) {
        return $http.get('/api/todos', {
          'params': params
        });
      },
      create: function(todoData) {
        return $http.post('/api/todos', todoData);
      },
      delete: function(id) {
        return $http.delete('/api/todos/' + id);
      }
    }
  }]);
