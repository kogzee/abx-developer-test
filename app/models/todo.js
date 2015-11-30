var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Todo = new Schema({
  'text': {
    'type': String,
    'required': 'Please enter a Todo'
  },
  'done': { 'type': Number, 'default': -1 } /* -1 = not done */
});

// provide the ability sort items at speed
Todo.index({ 'text': 1 });

// index by, text and done. ensure todo itemas are unique
// this means that people can add todo items again as new items if an existing item has already been completed
Todo.index({ 'text': 1, 'done': 1 }, { 'unique': true });

module.exports = mongoose.model('Todo', Todo );