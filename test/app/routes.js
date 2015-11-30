"use strict";

var debug = require('debug')('test/app/routes.js');
var expect = require('expect.js');
var rewire = require('rewire');
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost:27017/test_todos';

// The routes module attaches Express API routes to the app
var routes = rewire('../../app/routes.js');
routes(app);

describe('app/routes.js tests', function() {
  /*
  before(function mockCallsToMongoDb() {
    routes.__set__('Todo', {
      'find': function find(conditions, projection, options, callback) {
        var payload = [{ text: 'Todo 1' }, { text: 'Todo 2' }, { text: 'Todo 3' }, { text: 'Todo 4' }, { text: 'Todo 5' }, { text: 'Todo 6' }];
        conditions(null, payload);
      }
    });
  });
  */
 
  before(function(done) {
    mongoose.connect( dbURI ); // Connect to test DB

    done();
  });

  // Create brand new item
  it('create new todo item /api/todos route', function(done) {
    request(app)
      .post('/api/todos')
      .send( { 'text': 'Todo 1'} )
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, res) {
        expect(res.body.length).to.eql(1);
        expect(res.body[0].text).to.eql('Todo 1');

        done();
      });
  });

  // Attempt to add the same item again
  it('create new todo item, test duplicate error /api/todos route', function(done) {
    request(app)
      .post('/api/todos')
      .send( {  'text': 'Todo 1'} )
      .expect('Content-Type', /json/)
      .expect(409)
      .end(function(err, res) {
        expect(res.body.message).to.contain('Todo 1');

        done();
      });
  });

  // Attempt to add an item with no text
  it('create new todo item, test null entry /api/todos route', function(done) {
    request(app)
      .post('/api/todos')
      .send( { 'text': null} )
      .expect('Content-Type', /json/)
      .expect(422)
      .end(function(err, res) {
        expect(res.body.message).to.contain('Please enter a Todo');

        done();
      });
  });

  // List all todo items
  it('returns expected payload for /api/todos route', function(done) {
    request(app)
      .get('/api/todos')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.length).to.eql(1);
        expect(res.body[0].text).to.eql('Todo 1');

        done();
      });
  });

  // Attempt to delete an item with an invalid ID
  it('delete item, invalid item /api/todos/:id route', function(done) {
    request(app)
      .delete('/api/todos/1234')
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res) {

        done();
      });
  });

  // Delete an item with a valid ID
  it('delete item, valid item /api/todos/:id route', function(done) {
    request(app)
      .get('/api/todos')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {

        var id =  res.body[0]._id;

        request(app)
          .delete('/api/todos/' + id )
          .expect('Content-Type', /json/)
          .expect(500)
          .end(function(err, res) {

            done();
          });
      });
  });

  // Test the home page responds as a HTML doc
  it('returns a HTML document for / route', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        expect(res.text.substring(0, 15)).to.eql('<!doctype html>');
        done();
      });
  });

  // Test the app responds with 404 for unknown URLs
  it('returns 404 for a URL route that doesn\'t exist', function(done) {
    request(app)
      .get('/api/this-does-not-exist')
      .expect(404)
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

  // clean up test DB
  after(function(){
    require('mocha-mongoose')(dbURI);
  });
});
