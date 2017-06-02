'use strict';

// Set the default environment to production
process.env.NODE_ENV = process.env.NODE_ENV?process.env.NODE_ENV.trim():'production';

var app = require('./server/app.js')();

var port = 9000;
var server = require('http').createServer(app);

const db = app.get('db');

// Start
server.listen(port, function () {
    console.log('--------------------------------------\n' +
    'Magic happens on http://localhost:' + port + '/' +
    '\n--------------------------------------');
});
