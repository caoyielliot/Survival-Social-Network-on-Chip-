"use strict";

// initialize database
var path = require('path');
var assert = require('assert');
var initDB = require('../db/init_db');
var db = null;
var db_path = path.join(__dirname, '../db/table_profile.db');

// table_messages
describe('table_profile', function () {
    before(function () {
        // console.log(initDB);
        db = initDB.createDB(db_path);
    });

    after(function () {
        initDB.cleanDB(db_path);
    });

    it('should be able to save profiles', function (done) {
        
        var sample_data = {
            "originalName": 'elliot',
            "givenName": 'Yi',
            "surname": 'Cao',
            "streetAddress": 'Middlefield',
            "city": 'Mountain View',
            "state": 'CA',
            "zip": '94043',
            "image":'lalalalalal'
        };

        db.profile.saveProfile(db,
            function (row_id, error) {
                assert.equal(null, error);
                assert.equal(true, row_id);
                done();
            },
            sample_data);
    });

    it('should be able to get profiles', function (done) {
        var sample_data = {
            "originalName": 'elliot'
        };

        
        db.profile.getProfile(db, function (rows, error) {
            assert.equal(null, error);
            assert.equal(rows[0].givenName, "Yi");
            assert.equal(rows[0].surname, "Cao");
            assert.equal(rows[0].streetAddress, "Middlefield");
            assert.equal(rows[0].city, "Mountain View");
            assert.equal(rows[0].state, "CA");
            assert.equal(rows[0].zip, "94043");
            assert.equal(rows[0].image, "lalalalalal");
            done();
        }, sample_data);
    
    });

});