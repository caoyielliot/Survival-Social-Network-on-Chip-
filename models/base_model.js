"use strict";

/**
 * Created by shicheng on 3/21/16.
 */

var BaseModel = function() {
    // Set db for object
    this.db = require("../db/db.js");
}

// Set db for class
BaseModel.db = require("../db/db.js");

BaseModel.prototype.updateDB = function(db) {
    this.db = db;
    BaseModel.db = db;
};

module.exports = BaseModel;