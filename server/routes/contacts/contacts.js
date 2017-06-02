'use strict';

module.exports = function(app) {

    const contacts = require('../../components/contacts/contacts.bao.js')(app);

    // Create
    app.put('/api/contacts', function (req, res, next) {
        if ('id' in req.body) delete req.body.id;
        contacts.create(req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });
    //get all 
    app.get('/api/contacts/find', function (req, res, next) {
        console.log(req.query)
        contacts.findAll(req.query,function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });


    // Read by id
    app.get('/api/contacts/:id', function (req, res, next) {
        contacts.getOne(req.params.id, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

    // Read by company id
    app.get('/api/contacts/bycompany/:id', function (req, res, next) {
        contacts.get({companyId:req.params.id}, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

    
    // Read by query
    app.get('/api/contacts', function (req, res, next) {
        contacts.get(req.query, function (err, result) {
          console.log(err);
            if (err) return next(err);
            res.json(result);
        });
    });

    // Update batch
    app.post('/api/contacts/batch', function (req, res, next) {
        // console.log('batch',req.body);
        contacts.updatebatch(req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

    // Update
    app.post('/api/contacts/:id', function (req, res, next) {
        //let params = {id: req.params.id};
        contacts.update(req.params.id, req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

    // Delete
    app.delete('/api/contacts/:id', function (req, res, next) {
        var params = {id: req.params.id};
        contacts.delete(params, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });

};
