var Todo = require('./models/todo');
var extractDBErrors = require('./extractDBError');

function getTodos(res) {
  Todo.find(function(err, todos) {
    if (err) res.send(err)
    res.json(todos);
  });
};

module.exports = function(app) {

  app.get('/api/todos', function(req, res) {
    getTodos(res);
  });

  app.post('/api/todos', function(req, res) {
    Todo.create({
      'text': req.body.text,
      'done': false
    })
    .then(
      function _success(todo) {
        getTodos(res);
      },
      function _error( err ) {
        var error = extractDBErrors( err, req.body.text );
        res.status( error.code ).json( error );
      }
    );

  });

  app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
      '_id': req.params.todo_id
    })
    .then(
      function _success(todo) {
        getTodos(res);
      },
      function _error( err ) {
        var error = extractDBErrors( err );
        res.status( error.code ).json( error );
      }
    );
  });

  app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
  });
};
