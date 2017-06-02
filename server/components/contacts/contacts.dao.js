var _ = require("underscore");

module.exports = function(db) {
    var module = {};
    
    module.count = function(query, cb) {
        var q = query || {};
        db.contacts.count(q.query||{}, function(err, result) {
            cb(err, result);
        });
    };

    module.get = function(query, cb) {
        var q = query || {};
        var options = _.pick(q, 'limit', "offset", "order");
        _.each(options.order || [], function(item) {
          item.field = "\"" + item.field + "\"";
        });
        _.each(options.columns || [], function(item) {
          item.field = "\"" + item.field + "\"";
        });
        db.contacts_statuslabel.find(q.query||{}, options, function(err, result) {
            cb(err, result);
        });
    };


     module.findAll = function(query, cb) {
         var individualCriteria = Object.keys(query)
         var constructQuery = "" + individualCriteria[0] + "=$1 OR " + individualCriteria[1] + "=$2"
        db.contacts.where(constructQuery,[query[individualCriteria[0]],query[individualCriteria[1]]], function(err, result) {
            cb(err, result);
        });
    };


    module.getOne = function(id, cb) {
        db.contacts_statuslabel.findOne(id, function(err, result) {
            cb(err, result);
        });
    };

    module.create = function(row, cb) {
        delete row.id;
        delete row.statusLabel;
        db.contacts.save(row, function(err, result) {
            cb(err, result);
        });
    };

    module.update = function(id, row, cb) {
        row.id = id;
        delete row.statusLabel;
        db.contacts.save(row, function(err, result) {
            cb(err, result);
        });
    };

    module.updatebatch = function(rows, cb) {
        // Inserts and updates
        for (var ii=0; ii<rows.existing.length; ii++) {
            delete rows.existing[ii].statusLabel;
            db.contacts.save(rows.existing[ii], function(err, result) {
                cb(err, result);
            });
        }
        // Deletions
        for (var ii=0; ii<rows.deleted.length; ii++) {
            db.contacts.destroy({id:rows.deleted[ii].id}, function(err, result) {
                cb(err, result);
            });
        }

    };

    module.delete = function(id, cb) {
        db.contacts.destroy(id, function(err, result) {
            cb(err, result);
        });
    };

    return module;
};
