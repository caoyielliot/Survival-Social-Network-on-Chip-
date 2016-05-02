"use strict";

// initialize database
var path = require('path');
var assert = require('assert');
var initDB = require('../db/init_db');
var db = null;
var db_path = path.join(__dirname, '../db/table_status.db');

// table_users
describe('table_status', function () {
    before(function () {
        db = initDB.createDB(db_path);
    });

    after(function () {
        initDB.cleanDB(db_path);
    });

    it('should be able to insert a user and status', function (done) {
        db.users.insertUser(db, function (row_id, error) {
            assert.equal(null, error);
            assert.equal(2, row_id);
            db.status.insertStatus(db, function(row_id, error) {
                assert.equal(null, error);
                done();
            }, {
                "USER_NAME": "test",
                "STATUS": "Undefined"
            });
        }, {
            "NAME": "test",
            "PASSWORD": "123456"
        });
    });

    it('should be able to update location', function(done) {
        db.status.updateLocation(db, function(row_id, error) {
            assert.equal(null, error);
            assert.equal(2, row_id);
            done();
        }, {
            "USER_NAME": "test",
            "LOCATION": "37º24'37.687\"N, 122º3'35.024\"W"
        });
    });

    it('should be able to get location', function(done) {
        db.status.getLocation(db, function(row, error) {
            assert.equal(null, error);
            assert.equal("37º24'37.687\"N, 122º3'35.024\"W", row["LOCATION"]);
            done();
        }, {
            "USER_NAME": "test"
        });
    });
});