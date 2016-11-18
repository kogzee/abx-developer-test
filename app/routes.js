var Todo = require('./models/todo');

function getTodos(res) {
  Todo.find().exec()
    .then(function (todos) {
      res.json(todos);
    })
    .then(null, function (err) {
      res.send(err);
    });
  // Todo.find(function(err, todos) {
  //   if (err) res.send(err)
  //   res.json(todos);
  // });
};

module.exports = function (app) {

  app.get('/api/todos', function (req, res) {
    getTodos(res);
  });

  app.post('/api/todos', function (req, res) {
    Todo.create({
      text: req.body.text,
      done: false
    }).exec()
      .then(function (todo) {
        getTodos(res);
      })
      .then(null, function (err) {
        res.send(err);
      });
  });

  app.delete('/api/todos/:todo_id', function (req, res) {
    Todo.remove({
      _id: req.params.todo_id
    }).exec()
      .then(function (todo) {
        getTodos(res);
      })
      .then(null, function (err) {
        res.send(err);
      });
  });

  app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
  });
};
