"use strict";

// initialize database
var path = require('path');
var assert = require('assert');
var initDB = require('../db/init_db');
var db = null;
var db_path = path.join(__dirname, '../db/table_announcement.db');

describe('table_announcements', function () {
    before(function () {
        // console.log(initDB);
        db = initDB.createDB(db_path);
    });

    after(function () {
        initDB.cleanDB(db_path);
    });

    it('should be able to save announcement', function (done) {
        var sample_data = {
            "NAME": 'test',
            "ANNOUNCEMENT": 'post announcement test',
            "TIMESTAMP": '03/05/2016 10:10:30'
        };

        db.announcements.insertAnnouncement(db,
            function (saved, error) {
                assert.equal(null, error);
                assert.equal("InsertedAnnouncement", saved);
                done();
            }, sample_data);
    });

});