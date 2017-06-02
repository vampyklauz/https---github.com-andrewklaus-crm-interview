var kendoUtils = require("./../common/kendo_utils.js");

module.exports = function(app) {
    const db = app.get('db');
    const companiesDao = require("./companies.dao.js")(db);

    var module = {};

    module.get = function(query, cb) {
      var k = kendoUtils.prepareKendoQueryParams(query);
      console.log(k,k.query.order);

      companiesDao.count(k.query, function(err, count) {
        if (err) {
          cb(err);
        } else {
          console.log(count);
          companiesDao.get(k.query, function(err, result) {
            if (err) {
              cb(err)
            } else {
              var res = kendoUtils.prepareKendoData(result, count, k.groupConfig);
              if (res.groups) {
                  // Build the group counts
                  var groups = [];
                  for (ii = 0; ii < res.groups.length; ii++) {
                      groups.push({field: res.groups[ii].field, value: res.groups[ii].value});
                  }
                  console.log(groups);
                  companiesDao.countGroups(groups, function (err, countGroups) {
                      if (err) {
                          cb(err);
                      } else {
                          console.log(countGroups);
                          for (ii = 0; ii < res.groups.length; ii++) {
                              if (res.groups[ii].field != countGroups[ii].field ||
                                  res.groups[ii].value != countGroups[ii].value )
                                  cb('Ordering mismatch between the groups and group counts!');
                              res.groups[ii].aggregates = countGroups[ii].aggregates;
                          }
                          cb(null, res);
                      }
                  });
              }
              else cb(null, res);
            }
          });
        }
      });
    };
    
    module.getDetails = function(id, cb) {
        if (Number(id)) {
            companiesDao.getDetails(Number(id), cb);
        } else {
            cb("No id given");
        }
    };

    module.getOne = function(id, cb) {
        if (Number(id)) {
            companiesDao.getOne(Number(id), cb);
        } else {
            cb("No id given");
        }
    };

    module.create = function(row, cb) {
        if (row) {
            companiesDao.create(row, cb);
        } else {
            cb("No row data given");
        }
    };

    module.update = function(id, row, cb) {
        if (Number(id)) {
            companiesDao.update(Number(id), row, cb);
        } else {
            cb("No id given");
        }
    };

    module.delete = function(id, cb) {
        if (id) {
            companiesDao.delete(id, cb);
        } else {
            cb("No id given");
        }
    };

    module.indexOf = function(id, cb) {
        if (id>0) {
            companiesDao.indexOf(id, cb);
        } else {
            cb("No id given");
        }
    };

    return module;
};
