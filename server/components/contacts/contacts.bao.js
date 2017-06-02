var kendoUtils = require("./../common/kendo_utils.js");

module.exports = function(app) {
    const db = app.get('db');
    const contactsDao = require("./contacts.dao.js")(db);

    var module = {};

    module.get = function(query, cb) {
        var k = kendoUtils.prepareKendoQueryParams(query);
        contactsDao.count(k.query, function(err, count) {
            if (err) {
                cb(err);
            } else {
                contactsDao.get(k.query, function(err, result) {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, kendoUtils.prepareKendoData(result, count, k.groupConfig));
                    }
                });
            }
        });
    };

    module.getOne = function(id, cb) {
        contactsDao.getOne(id, cb);
    };
     module.findAll = function(query, cb) {
        contactsDao.findAll(query,cb);
    };

    module.create = function(row, cb) {
        if (row) {
            contactsDao.create(row, cb);
        } else {
            cb("No row data given");
        }
    };

    module.update = function(id, row, cb) {
        if (Number(id)) {
            contactsDao.update(Number(id), row, cb);
        } else {
            cb("No id given");
        }
    };

    module.updatebatch = function(rows, cb) {
        if ( rows && Array.isArray(rows.existing) && Array.isArray(rows.deleted)  ) {
            contactsDao.updatebatch(rows, cb);
        } else {
            cb("Array of rows is required");
        }
    };

    module.delete = function(id, cb) {
        if (id) {
            contactsDao.delete(id, cb);
        } else {
            cb("No id given");
        }
    };

    return module;
};
