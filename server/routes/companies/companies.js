'use strict';

module.exports = function(app) {

    const companies = require('../../components/companies/companies.bao.js')(app);

    // Create
    app.put('/api/companies', function (req, res, next) {
        companies.create(req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });
    
    // Read
    app.get('/api/companies/details/:id', function (req, res, next) {
        companies.getDetails(req.params.id, function (err, result) {
          console.log(err);
            if (err) return next(err);
            res.json(result);
        });
    });

    // Read
    app.get('/api/companies/:id', function (req, res, next) {
        companies.getOne(req.params.id, function (err, result) {
          console.log(err);
            if (err) return next(err);
            res.json(result);
        });
    });

    // Get index
    app.get('/api/companies/index/:id', function (req, res, next) {
        companies.indexOf(req.params.id, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

    // Read
    app.get('/api/companies', function (req, res, next) {
        companies.get(req.query, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

    // Update
    app.post('/api/companies/:id', function (req, res, next) {
        //let params = {id: req.params.id};
        companies.update(req.params.id, req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

    // Delete
    app.delete('/api/companies/:id', function (req, res, next) {
        var params = {id: req.params.id};
        companies.delete(params, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

};
