const fs = require("fs");
const path = require("path");
var normalizedPath = path.join(__dirname, "./");

// This will not import files in the base routes folder - ONLY those in sub folders
module.exports = function(app) {

    function requireAllFilesInDirectoryTree(path1, level) {
        fs.readdirSync(path1).forEach(function (file) {
            var path2 = path.join(path1, file);
            var stat = fs.statSync(path2);
            if (level>0 && file!='.DS_Store' && ((stat.mode & fs.constants.S_IFREG) == fs.constants.S_IFREG)) { // if not this file and is regular file
                require(path2)(app);
            } else if (((stat.mode & fs.constants.S_IFDIR) == fs.constants.S_IFDIR)) { // If directory
                requireAllFilesInDirectoryTree(path2, level+1);
            }
        });
    }

    requireAllFilesInDirectoryTree(path.join(normalizedPath, './'), 0);

};
