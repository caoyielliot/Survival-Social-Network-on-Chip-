"use strict";

// initialize database
var path = require('path');
var assert = require('assert');
var initDB = require('../db/init_db');
var db = null;
var db_path = path.join(__dirname, '../db/table_users.db');

// table_users
describe('table_users', function () {
    before(function () {
        console.log(initDB);
        db = initDB.createDB(db_path);
    });

    after(function () {
        initDB.cleanDB(db_path);
    });

    it('should be able to get all active user', function(done) {
        db.users.getActiveUsers(db, function (rows, error) {
            assert.equal("SSNAdmin", rows[0]['NAME']);
            assert.equal(null, error);
            done();
        });
    });

    it('should be able to insert a user', function (done) {
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

    it('should be able to authenticate a user', function (done) {
        var sample_data = {
            "NAME": "test",
            "PASSWORD": "123456"
        };
        db.users.validateUser(db, function (authenticated, error) {
            assert.equal(null, error);
            assert.equal("test", authenticated['NAME']);
            done();
        }, sample_data);
    });

    it('should be able to change a users account status', function(done) {
        var sample_data = {
            "NAME": "test",
            "ACCOUNTSTATUS" : "Inactive"
        };
        db.users.updateUserAccountStatus(db, function (updated, error) {
            assert.equal(null, error);
            assert.equal(true, updated);
            done();
        }, sample_data);
    });

    it('should be able to get all users', function(done) {
        db.users.getUsers(db, function (rows, error) {
            assert.equal("SSNAdmin", rows[0]['NAME']);
            assert.equal(null, error);
            done();
        });
    });

    it('should be able to get all inactive user', function(done) {
        db.users.getInActiveUsers(db, function (rows, error) {
            assert.equal("test", rows[0]['NAME']);
            assert.equal(null, error);
            done();
        });
    });

    it('should not change Administrator privilege when there is only one Administrator', function(done) {
        var sample_data = {
            "NAME": "SSNAdmin",
            "PRIVILEGELEVEL" : "Citizen"
        };
        db.users.updateUserPrivilegeLevel(db, function (updated, error) {
            assert.equal("System should have at least one administrator", error.message);
            assert.equal(null, updated);
            done();
        }, sample_data);
    });

    it('should be able to change a users privilege', function(done) {
        var sample_data = {
            "NAME": "test",
            "PRIVILEGELEVEL" : "Administrator"
        };
        db.users.updateUserPrivilegeLevel(db, function (updated, error){
            assert.equal(null, error);
            assert.equal(true, updated);
            done();
        }, sample_data);
    });


    it('should be able to administrate user profile', function(done) {
        var sample_data = {
            "NAME": "test",
            "NEW_NAME": "test1",
            "PASSWORD": "anotherpassword",
            "ACCOUNTSTATUS": "Active",
            "PRIVILEGELEVEL" : "Administrator"
        };
        db.users.administrateUserProfile(db, function (updated, error){
            assert.equal(null, error);
            assert.equal(true, updated);
            done();
        }, sample_data);
    });


});
