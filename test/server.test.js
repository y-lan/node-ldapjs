// Copyright 2011 Mark Cavage, Inc.  All rights reserved.

var Logger = require('bunyan');

var test = require('tap').test;
var uuid = require('node-uuid');


///--- Globals

var BIND_DN = 'cn=root';
var BIND_PW = 'secret';

var SUFFIX = 'dc=test';

var ldap;
var Attribute;
var Change;
var client;
var server;
var sock;

function getSock() {
  if (process.platform === 'win32') {
    return '\\\\.\\pipe\\' + uuid();
  } else {
    return '/tmp/.' + uuid();
  }
}

///--- Tests

test('load library', function (t) {
  ldap = require('../lib/index');
  t.ok(ldap.createServer);
  t.end();
});

test('basic create', function (t) {
  server = ldap.createServer();
  t.ok(server);
  t.end();
});

test('listen on unix/named socket', { timeout: 1000 }, function (t) {
  t.plan(1);
  server = ldap.createServer();
  sock = getSock();
  server.listen(sock, function () {
    t.ok(true);
    server.close();
  });
});

test('listen on ephemeral port', { timeout: 1000 }, function (t) {
  t.plan(2);
  server = ldap.createServer();
  server.listen(0, 'localhost', function () {
    var addr = server.address();
    t.ok(addr.port > 0);
    t.ok(addr.port < 65535);
    server.close();
  });
});
