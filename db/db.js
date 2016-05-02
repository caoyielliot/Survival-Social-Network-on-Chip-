// references:
// http://blog.modulus.io/nodejs-and-sqlite

var config = require('../config/global.js');
var db_path = config.default.db.path;
var test_db_path = config.test.db.path; //for testing measure performance use case

var init_db = require('./init_db');

// This module only serves as a interface to init_db adapter
module.exports = init_db.createDB(db_path);

//This is just for testing measure performance use case
//module.exports = init_db.createDB(test_db_path);