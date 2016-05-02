"use strict";

// initialize database
var path = require('path');
var assert = require('assert');
var initDB = require('../db/init_db');
var db = null;
var db_path = path.join(__dirname, '../db/table_private_messages.db');

// table_private_messages
describe('table_private_messages', function () {
    before(function () {
        // console.log(initDB);
        db = initDB.createDB(db_path);
    });

    after(function () {
        initDB.cleanDB(db_path);
    });

    it('should be able to save private messages', function (done) {
        var sample_data = {
            "USERNAME1": 'test1',
            "USERNAME2": 'test2',
            "MESSAGE": "Hello World",
            "Timestamp": "02/28/2016 23:19:30 PM"
        };

        db.private_messages.savePrivateMessage(db, function (rows, error) {
            assert.equal(null, error);
            assert.equal(true, rows);
            done();
        }, sample_data);
    });

    it('should be able to get private messages', function (done) {
        var sample_data = {
            "USERNAME1": 'test1',
            "USERNAME2": 'test2',
            "MESSAGE": "Another message",
            "Timestamp": "02/28/2016 23:19:30 PM"
        };

        db.private_messages.savePrivateMessage(db, function (rows, error) {
            assert.equal(null, error);
            assert.equal(true, rows);
            db.private_messages.getPrivateMessage(db, function (row_id, error) {
                assert.equal(null, error);
                done();
            }, sample_data);

        }, sample_data);
    });

    it('should get all private messages', function(done) {
        db.private_messages.getAllPrivateMessages(db, function(rows, error) {
            assert.equal(null, error);
            assert.equal(rows[0].USERNAME1, "test1");
            assert.equal(rows[0].USERNAME2, "test2");
            assert.equal(rows[0].MESSAGE, "Hello World");
            assert.equal(rows[0].Timestamp, "02/28/2016 23:19:30 PM");
            done();
        });
    });
});