module.exports = function() {
    var massive = require('massive');
    // connect to Massive and get the db instance
    var connectionString = "postgres://crmtest:synergyCRM1@www.jtztek1.com/crmtest?ssl=true";
    var massiveInstance = massive.connectSync({connectionString : connectionString}) ;

    return massiveInstance;
};
