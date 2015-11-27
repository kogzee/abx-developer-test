"use strict";

var debug = require('debug')('test/app/routes.js');
var expect = require('expect.js');
var rewire = require('rewire');
var request = require('supertest');
var express = require('express');
var app = express();

// The routes module attaches Express API routes to the app
var routes = rewire('../../app/routes.js');
routes(app);

describe('app/routes.js tests', function() {
  before(function mockCallsToMongoDb() {
    routes.__set__('Todo', {
      find: function find(conditions, projection, options, callback) {
        var payload = [{ text: 'Todo 1' }, { text: 'Todo 2' }, { text: 'Todo 3' }, { text: 'Todo 4' }, { text: 'Todo 5' }, { text: 'Todo 6' }];
        conditions(null, payload);
      }
    });
  });

  it('returns expected payload for /api/todos route', function(done) {
    request(app)
      .get('/api/todos')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.length).to.eql(6);
        expect(res.body[0].text).to.eql('Todo 1');

        done();
      });
  });

  it('returns a HTML document for / route', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        expect(res.text.substring(0, 15)).to.eql('<!doctype html>');
        done();
      });
  });

  it('returns 404 for a URL route that doesn\'t exist', function(done) {
    request(app)
      .get('/api/this-does-not-exist')
      .expect(404)
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });
});
