var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Todo = new Schema({
  'text': {
    'type': String,
    'required': 'Please enter a Todo'
  },
  'dateAdded': { 'type': Date, 'default': Date.now },
  'done': { 'type': Boolean } /* -1 = not done */
});

// provide the ability sort items at speed
// index by, text and done. ensure todo itemas are unique
Todo.index({ 'text': 1 }, { 'unique': true });

module.exports = mongoose.model('Todo', Todo );