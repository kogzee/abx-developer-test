var Todo = require('./models/todo');

function getTodos(res) {
  Todo.find().exec()
    .then(function (todos) {
      res.json(todos);
    })
    .then(null, function (err) {
      res.send(err);
    });
};

module.exports = function (app) {

  app.get('/api/todos', function (req, res) {
    getTodos(res);
  });

  app.post('/api/todos', function (req, res) {
    var todoText = req.body.text;
    Todo.create({
      text: todoText,
      done: false
    }).then(function (todo) {
        getTodos(res);
      })
      .then(null, function (err) {
        if (err.code === 11000){
          res.status(400);
          res.send({message: todoText + ' is already in the Todo list'});
        }
        else {
          res.status(500);
          res.send({message:err.message});
        }
      
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
