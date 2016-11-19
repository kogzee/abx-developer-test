"use strict";

var debug = require('debug')('test/app/routes.js');
var expect = require('expect.js');
var rewire = require('rewire');
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//need the json parser to test our post
app.use(bodyParser.json());

// The routes module attaches Express API routes to the app
var routes = rewire('../../app/routes.js');
routes(app);

describe('app/routes.js tests', function () {
  before(function mockCallsToMongoDb() {
    routes.__set__('Todo', {
      find: function find() {
        //to mock mongoose promises, needs to return an .exec() function that returns a promise
        this.exec = function () {
          return new Promise(function (resolve, reject) {
            var payload = [{ text: 'Todo 1' }, { text: 'Todo 2' }, { text: 'Todo 3' }, { text: 'Todo 4' }, { text: 'Todo 5' }, { text: 'Todo 6' }];
            resolve(payload);
          });
        }
        return this;
      },
      create: function create(todo) {
        return new Promise(function (resolve, reject) {
          resolve(todo);
        });
      },
      remove: function remove(todo) {
        this.exec = function () {
          return new Promise(function (resolve, reject) {
            resolve(todo);
          });
        }
        return this;
      },
    });
  });

  it('returns expected payload for /api/todos route', function (done) {
    request(app)
      .get('/api/todos')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.length).to.eql(6);
        expect(res.body[0].text).to.eql('Todo 1');
        done();
      });
  });

  it('posts a new todo to the /api/todos route', function (done) {
    var newTodo = { text: 'Todo 7' };
    request(app)
      .post('/api/todos')
      .send(newTodo)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.length).to.eql(6);
        expect(res.body[0].text).to.eql('Todo 1');
        done();
      });
  });

  it('deletes an existing todo using the /api/todos route', function (done) {
    request(app)
      .delete('/api/todos/5830c474bfc9e5603ad43314')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.length).to.eql(6);
        expect(res.body[0].text).to.eql('Todo 1');
        done();
      });
  });

  it('returns a HTML document for / route', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        expect(res.text.substring(0, 15)).to.eql('<!doctype html>');
        done();
      });
  });

  it('returns 404 for a URL route that doesn\'t exist', function (done) {
    request(app)
      .get('/api/this-does-not-exist')
      .expect(404)
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });
});
