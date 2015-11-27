"use strict";

var expect = require('expect.js');
var database = require('../../config/database.js');

describe('config/database.js tests', function() {
  it('returns the correct MongoDB connection string', function() {
    expect(database.url).to.eql('mongodb://localhost:27017/todos');
  });
});
