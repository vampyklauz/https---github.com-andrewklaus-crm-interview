var _ = require("underscore");

function generateQueriedGroups(groupConfig, list, groups) {
  var group = groupConfig[0];
  var g = _.groupBy(list, group.field);
  _.each(g, function(val, key) {
    var res = {field: group.field
              ,hasSubgroups: false
              ,items: val || []
              ,value: key
              ,aggregates:[]};
    if (groupConfig.length>1) {
      res.hasSubgroups = true;
      res.items = [];
      generateQueriedGroups(_.rest(groupConfig), val, res.items)
    }
    groups.push(res);

  });
}

function guaranteeIsJsonArray(obj) {
  if (_.isString(obj)) {
    obj = JSON.parse(obj);
  }
  if (_.isArray(obj)) {
    obj = _.map(obj, function(item) {
      if (_.isString(item)) {
        return JSON.parse(item); 
      }
      return order;
    });
  } else {
    obj = [obj];
  }
  return obj;
}


function prepareFilterObjectOperator(filter, ret) {
  switch(filter.operator) {
    case "eq"://(equal to)
      ret[filter.field + " ilike"] = filter.value;
      break;
    case "neq"://(not equal to)
      ret[filter.field + " not ilike"] = filter.value;
      break;
    case "isnull":// (is equal to null)
      ret[filter.field] = null;
      break;
    case "isnotnull":// (is not equal to null)
      ret[filter.field + " <>"] = null;
      break;
    case "lt":// (less than)
      ret[filter.field + " <"] = filter.value;
      break;
    case "lte":// (less than or equal to)
      ret[filter.field + " <="] = filter.value;
      break;
    case "gt":// (greater than)
      ret[filter.field + " >"] = filter.value;
      break;
    case "gte":// (greater than or equal to)
      ret[filter.field + " >="] = filter.value;
      break;
    case "startswith":
      ret[filter.field + " ilike"] = filter.value+"%";
      break;
    case "endswith":
      ret[filter.field + " ilike"] = "%"+filter.value;
      break;
    case "contains":
      ret[filter.field + " ilike"] = "%"+filter.value+"%";
      break;
    case "doesnotcontain":
      ret[filter.field + " not ilike"] = "%"+filter.value+"%";
      break;
    case "isempty":
      ret[filter.field] = "";
      break;
    case "isnotempty":
      ret[filter.field + " <>"] = "";
      break;
    default:
      if (filter.logic) { // Add logic branch
        prepareFilterObjectLogic(filter, ret);
      }
      break;
  }
}

function prepareFilterObjectLogic(filter, ret) {
  switch (filter.logic) {
    case "and":
      _.each(filter.filters, function(itemFilter) {
        var operator = {};
        prepareFilterObjectOperator(itemFilter, operator);
        _.extend(ret, operator);
      });
      break;
    case "or":
      ret.or = [];
      _.each(filter.filters, function(itemFilter) {
        var operator = {};
        prepareFilterObjectOperator(itemFilter, operator);
        ret.or.push(operator);
      });

      break;
    default:

      break;
  }
}

function prepareFilterObject(filter) {
  filter = JSON.parse(filter);
  var ret = {};
  prepareFilterObjectLogic(filter, ret);
  return ret;
}

module.exports = {
  prepareKendoQueryParams: function(query) {
      if (query.sort) {
        query.sort = guaranteeIsJsonArray(query.sort);
      }
      if (query.group) {
        query.group = guaranteeIsJsonArray(query.group);
      }
      if (query.filter) {
        query.filter = prepareFilterObject(query.filter) ;
      }
      if (query.companyId) {
        if (!query.filter) query.filter = {};
        query.filter['companyId ='] = query.companyId;
      }
      var group = query.group || [];
      var order = _.map(query.group, function(sort) {
                    return {field: sort.field, direction: sort.dir};
                  });
      order = order.concat(_.map(query.sort, function(sort) {
                    return {field: sort.field, direction: sort.dir};
                  }));
      var default_order =  [{field:'id',direction: 'asc'}];
      query =  {offset: query.skip?Number(query.skip):0, limit: query.take?Number(query.take):20, order:order.length>0?order:default_order, query: query.filter, columns: query.columns};
      return {query: query, groupConfig: group}
  },
  prepareKendoData: function(resultList, count, groupConfig) {
    var res = {list: resultList, total: count};
    if (groupConfig.length > 0) {
      res.groups = [];
      generateQueriedGroups(groupConfig, res.list, res.groups);
      res.list = [];
    }
    return res;
  }
};
