var Todo = require('./models/todo');
var extractDBErrors = require('./extractDBError');

/**
 * Using the default mongo $sort function
 * This has an issue of not sorting upper and lower case strings as equals
 * @param  {Object) query query object as passed through from HTTP request
 * @return {Object}       mongoose friendly sort object
 */
function computeSort( query ) {
  var sort = {}, order;
  if( query.sort && query.order ) {
    order = parseInt(query.order );
    // Test NAN and infinite etc.
    if(!isFinite(order)) {
      order = 1;
    }
    sort[ query.sort ] = parseInt( order );
  } else {
    sort = { 'dateAdded': -1 };
  }

  return sort;
}

function getTodos(req, res) {
  var sort = computeSort( req.query );
  
  Todo
    .find()
    .sort( sort )
    .exec()
    .then(
      function _success( todos ) {
        res.status(200).json(todos);
      },
      function _error( err ) {
        res.status(401).json(err);
      }
    )
};

module.exports = function(app) {

  app.get('/api/todos', function(req, res) {
    getTodos(req, res);
  });

  app.post('/api/todos', function(req, res) {
    Todo
    .create({
      'text': req.body.text,
      'done': false
    })
    .then(
      function _success(todo) {
        getTodos(req, res);
      },
      function _error( err ) {
        var error = extractDBErrors( err, req.body.text );
        res.status( error.code ).json( error );
      }
    );

  });

  app.delete('/api/todos/:todo_id', function(req, res) {
    Todo
    .remove({
      '_id': req.params.todo_id
    })
    .exec()
    .then(
      function _success(todo) {
        getTodos(req, res);
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
