'use strict';

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const pg = require('pg');

module.exports = function() {
    // --------------------
    // Express setup
    var app = express();
    app.set('appPath', 'client');
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    if (process.env.NODE_ENV == 'development') app.use(require('connect-livereload')());

    app.use(cookieParser());
    app.use(bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // --------------------
    // Database setup
    var massiveInstance = require('./config/db.js')();
    // Set a reference to the massive instance on Express' app:
    app.set('db', massiveInstance);

    // Manual processing for the root path
    app.get('/', function(req, res,next) {
        res.render('pages/index');
    });

    app.use(express.static(path.join(path.normalize(__dirname), '../client')));
    require('./routes')(app);

    // Error handler
    app.use(function(err, req, res, next) {
        err.status  = err.status || 500;
        err.message = err.message.replace(__dirname,'');
        res.status(err.status);
        if (err.status == 401) res.send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/auth"></head></html>');
        else res.send(err.message);
        console.error(err);
    });

    return app;
};
