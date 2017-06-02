var _ = require("underscore");

module.exports = function(db) {
    var module = {};
    
    module.count = function(query, cb) {
        var q = query || {};
        var options = {};
        db.companies_statuslabel.count(q.query||{}, function(err, result) {
            cb(err, result);
        });
    };

    module.countGroups = function(groups, cb) {
        db.get_count(JSON.stringify(groups), function(err, result) {
            cb(err, result[0].get_count);
        });
    };

    module.get = function(query, cb) {
        var q = query || {};
        var options = {};
        options = _.pick(q, 'limit', "offset", "order");
        _.each(options.order || [], function(item) {
          item.field = "\"" + item.field + "\"";
        });
        _.each(options.columns || [], function(item) {
          item.field = "\"" + item.field + "\"";
        });
        db.companies_statuslabel.find(q.query||{}, options, function(err, result) {
            cb(err, result);
        });
    };
    
    module.getDetails = function(id, cb) {
        db.company_details.findOne({id: id}, function(err, result) {
            cb(err, result);
        });
    };

    module.getOne = function(id, cb) {
        db.companies_statuslabel.findOne({id:id}, function(err, result) {
            cb(err, result);
        });
    };

    module.create = function(row, cb) {
        delete row.id;
        delete row.statusLabel;
        db.companies.save(row, function(err, result) {
            cb(err, result);
        });
    };

    module.update = function(id, row, cb) {
        row.id = id;
        delete row.statusLabel;
        db.companies.save(row, function(err, result) {
            cb(err, result);
        });
    };

    module.delete = function(id, cb) {
        db.companies.destroy(id, function(err, result) {
            cb(err, result);
        });
    };

    module.indexOf = function(id, cb) {
        db.run("SELECT s.rnum FROM (SELECT id,row_number() OVER () as rnum  FROM public.companies ORDER BY id ASC) s WHERE id="+id, function(err, result) {
            cb(err, result);
        });

    };

    return module;
};
