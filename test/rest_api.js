"use strict";

// initialize database
var assert = require('assert');
var request = require('supertest');
var app = null;

before(function () {
    var config = require('../config/global');
    var db_path = config.default.db.path;
    var init_db = require('../db/init_db');
    init_db.cleanDB(db_path);

    app = require('../app');
});

// sample test from https://github.com/visionmedia/supertest
describe('ping pages', function () {

    it('index page', function (done) {
        request(app)
            .get('/')
            .expect(200, done);
    });

    it('lobby page', function (done) {
        request(app)
            .get('/partials/lobby')
            .expect(200, done);
    });

    it('not found page', function (done) {
        request(app)
            .get('/random_page')
            .expect(404, done);
    })

});

describe('rest apis', function () {
    var Cookies;

    it('should register a user if user does not exist', function (done) {
        var req = request(app).post('/users');
        req
            .send({username: "hhyhhyhhy", password: "hhy0302"})
            .expect(201)
            .end(function (err, res) {
                assert.equal(res.text, "signup");
                // Save the cookie to use it later to retrieve the session
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
                done();
            });
    });
    it('should login a user if user exists', function (done) {
        var req = request(app).post('/users');
        // Set cookie to get saved user session
        req
            .send({username: "hhyhhyhhy", password: "hhy0302"})
            .expect(200)
            .end(function (err, res) {
                // console.log(res);
                assert.equal(res.text, "login");
                // Save the cookie to use it later to retrieve the session
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
                done();
            });
    });

    it('should validate the test user exists', function (done) {
        var req = request(app).get('/users/hhyhhyhhy');
        req.cookies = Cookies;
        // Set cookie to get saved user session
        req.expect(200, done);
    });

    it('should validate a non-exist user does not exist', function (done) {
        var req = request(app).get('/users/xscxscxsc');
        req.cookies = Cookies;
        // Set cookie to get saved user session
        req.expect(404, done);
    });

    it('should identify the test user as current user', function (done) {
        var req = request(app).post('/users/current_user');
        req.cookies = Cookies;
        // Set cookie to get saved user session
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.body.username, "hhyhhyhhy");
                done();
            });
    });

    it('should list the test user', function (done) {
        var req = request(app).get('/users');
        req.cookies = Cookies;
        // Set cookie to get saved user session
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].NAME, "SSNAdmin");
                done();
            });
    });

    it("should get all active user", function (done) {
        var req = request(app).get('/users/active');
        req.cookies = Cookies;
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].NAME, "SSNAdmin");
                done();
            });

    });

    it("should set a user inactive", function (done) {
        var req = request(app).post('/users/hhyhhyhhy/inactive');
        req.cookies = Cookies;
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.text, "User is set Inactive");
                done();
            });

    });

    it('should list the test user', function (done) {
        var req = request(app).get('/users');
        req.cookies = Cookies;
        // Set cookie to get saved user session
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].NAME, "SSNAdmin");
                done();
            });
    });

    it("should get all inactive user", function (done) {
        var req = request(app).get('/users/inactive');
        req.cookies = Cookies;
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].NAME, "hhyhhyhhy");
                done();
            });

    });

    it("should set a user active", function (done) {
        var req = request(app).post('/users/hhyhhyhhy/active');
        req.cookies = Cookies;
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.text, "User is set Active");
                done();
            });

    });

    it('should list the test user', function (done) {
        var req = request(app).get('/users');
        req.cookies = Cookies;
        // Set cookie to get saved user session
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].NAME, "SSNAdmin");
                done();
            });
    });

    it("should set a user as coordinator", function (done) {
        var req = request(app).post('/users/hhyhhyhhy/coordinator');
        req.cookies = Cookies;
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.text, "User is set as Coordinator");
                done();
            });

    });

    it("should set a user as administrator", function (done) {
        var req = request(app).post('/users/hhyhhyhhy/administrator');
        req.cookies = Cookies;
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.text, "User is set as Administrator");
                done();
            });

    });

    it("should set a user as monitor", function (done) {
        var req = request(app).post('/users/hhyhhyhhy/monitor');
        req.cookies = Cookies;
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.text, "User is set as Monitor");
                done();
            });

    });

    it("should set a user as citizen", function (done) {
        var req = request(app).post('/users/hhyhhyhhy/citizen');
        req.cookies = Cookies;
        req.expect(200)
            .end(function (err, res) {
                assert.equal(res.text, "User is set as Citizen");
                done();
            });

    });

    it("should administrate user profile", function (done) {
        var req = request(app).post('/users/administrate_user_profile');
        req.cookies = Cookies;
        req.send({
            userName: "hhyhhyhhy",
            newName: "hhyhhyhhy",
            password: "hhy0403",
            accountStatus: "Active",
            privilegeLevel: "Monitor"
        }).expect(200)
            .end(function (err, res) {
                assert.equal(res.text, "User profile updated");
                done();
            });

    });


    it("should update the test user's status", function (done) {
        var req = request(app).post('/status');
        req.cookies = Cookies;
        req
            .send({user_name: "hhyhhyhhy", status: "OK"})
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.text, "OK");
                done();
            });
    });

    it("should return 404 when update a non-exist user's status", function (done) {
        var req = request(app).post('/status');
        req.cookies = Cookies;
        req
            .send({user_name: "xscxscxsc", "status": "OK"})
            .expect(404, done);
    });

    it("should post announcement", function (done) {
        var req = request(app).post('/messages/announcements');
        req.cookies = Cookies;
        req
            .send({username: "hhyhhyhhy", content: "all your bases belongs to us"})
            .expect(201)
            .end(function (err, res) {
                assert.equal(res.text, "Announcement created");
                done();
            });

    });

    it("should return 404 for non-exist user post announcement", function (done) {
        var req = request(app).post('/messages/announcements');
        req.cookies = Cookies;
        req
            .send({username: "xscxscxsc", content: "I see dead people"})
            .expect(404)
            .end(function (err, res) {
                assert.equal(res.text, "User does not exist");
                done();
            });

    });

    it("should get announcements", function (done) {
        var req = request(app).get('/messages/announcements');
        req.cookies = Cookies;
        req
            .send({username: "hhyhhyhhy", content: "there are a lot of staffs"})
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].ANNOUNCEMENT, "all your bases belongs to us");
                done();
            });

    });


    it("should get the test user's status", function (done) {
        var req = request(app).get('/status/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.body.STATUS, "OK");
                done();
            });
    });

    it("should return 404 when get a non-exist user's status", function (done) {
        var req = request(app).get('/status/xscxscxsc');
        req.cookies = Cookies;
        req
            .expect(404, done);
    });

    it("should put public messages", function (done) {
        var req = request(app).post('/messages/public/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .send({username: "hhyhhyhhy", message: "all your bases belongs to us", timestamp: "03/22/2016 14:00:00"})
            .expect(201)
            .end(function (err, res) {
                assert.equal(res.text, "Message created");
                done();
            });

    });

    it("should put public picture", function (done) {
        var req = request(app).post('/messages/public/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .send({username: "hhyhhyhhy", message: "data:image/png;base64,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", timestamp: "03/22/2016 14:00:00"})
            .expect(201)
            .end(function (err, res) {
                assert.equal(res.text, "Message created");
                done();
            });

    });

    it("should return 500 when cannot public messages", function (done) {
        var req = request(app).post('/messages/public/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .send({username: "hhyhhyhhy"})
            .expect(500)
            .end(function (err, res) {
                assert.equal(res.text, "Error writing message to database");
                done();
            });

    });

    it("should get users' public message", function (done) {
        var req = request(app).get('/messages/public/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .send({username: "hhyhhyhhy", message: "all your bases belongs to us", timestamp: "03/22/2016 14:00:00"})
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].MESSAGE, "all your bases belongs to us");
                done();
            });

    });

    it('should register a user for private chat', function (done) {
        var req = request(app).post('/users');
        req
            .send({username: "bobobowen", password: "yang"})
            .expect(201)
            .end(function (err, res) {
                assert.equal(res.text, "signup");
                // Save the cookie to use it later to retrieve the session
                done();
            });
    });

    it("should put private messages", function (done) {
        var req = request(app).post('/messages/private/hhyhhyhhy/bobobowen');
        req.cookies = Cookies;
        req
            .send({
                username1: "hhyhhyhhy",
                username2: "bobobowen",
                message: "all your bases belongs to us",
                timestamp: "03/22/2016 14:00:00"
            })
            .expect(201)
            .end(function (err, res) {
                assert.equal(res.text, "Message created");
                done();
            });

    });  

    it("should return 404 when non-exist user tries to chat as user1", function (done) {
        var req = request(app).post('/messages/private/hhyhhyhhy/xscxscxsc');
        req.cookies = Cookies;
        req
            .send({
                username1: "hhyhhyhhy",
                username2: "xscxscxsc"
            })
            .expect(404)
            .end(function (err, res) {
                assert.equal(res.text, "User does not exist");
                done();
            });

    });

    it("should return 404 when non-exist user tries to chat as user2", function (done) {
        var req = request(app).post('/messages/private/xscxscxsc/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .send({
                username1: "xscxscxsc",
                username2: "hhyhhyhhy"
            })
            .expect(404)
            .end(function (err, res) {
                assert.equal(res.text, "User does not exist");
                done();
            });

    });

    it("should return 404 when non-exist user ", function (done) {
        var req = request(app).post('/profile/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .send({
                originalName: "hhyhhyh"
            })
            .expect(404)
            .end(function (err, res) {
                assert.equal(res.text, "User does not exist");
                done();
            });

    });

     it("should put profiles", function (done) {
        var req = request(app).post('/profile/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .send({
            originalName: 'hhyhhyhhy',
            givenName: 'Yi',
            surname: 'Cao',
            streetAddress: 'Middlefield',
            city: 'Mountain View',
            state: 'CA',
            zip: '94043',
            image:'lalalalalal'})
            .expect(201)
            .end(function (err, res) {
                assert.equal(res.text, "Profile created");
                done();
            });

    });

    it("should get users' private message", function (done) {
        var req = request(app).get('/messages/private/hhyhhyhhy/bobobowen');
        req.cookies = Cookies;
        req
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].MESSAGE, "all your bases belongs to us");
                done();
            });

    });

    it("should get all private messages", function (done) {
        var req = request(app).get('/messages/private');
        req.cookies = Cookies;
        req
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].MESSAGE, "all your bases belongs to us");
                done();
            });

    });

    it("should update location", function(done) {
       var req = request(app).post('/status/save_location');
        req.cookies = Cookies;
        req.send({user_name: "hhyhhyhhy", location: "37º24'37.687\"N, 122º3'35.024\"W"}).expect(200).end(function(err, res) {
            console.log(res.body);
            done();
        });
    });

    it("should return 404 when non-exist user try to update location", function(done) {
        var req = request(app).post('/status/save_location');
        req.cookies = Cookies;
        req.send({user_name: "xscxscxsc", location: "37º24'37.687\"N, 122º3'35.024\"W"}).expect(404, done);
    });

    it("should get location", function(done) {
        var req = request(app).post('/status/get_location');
        req.cookies = Cookies;
        req.send({user_name: "hhyhhyhhy"}).expect(200).end(function(err, res) {
            assert.equal(res.body["LOCATION"], "37º24'37.687\"N, 122º3'35.024\"W");
            done();
        });
    });

    it("should get users' profiles", function (done) {
        var req = request(app).get('/profile/hhyhhyhhy');
        req.cookies = Cookies;
        req
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.body[0].city, 'Mountain View');
                done();
            });

    });


   
    it("should successfully logout", function (done) {
        var req = request(app).get('/logout');
        req.cookies = Cookies;
        req.expect(302, done);
    });
});
