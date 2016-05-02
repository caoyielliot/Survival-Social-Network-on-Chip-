var db = require('../db/db.js');

module.exports = {
  insertStatus: function(handler, data) {
    db.status.insertStatus(db, handler, data);
  },
  getStatus: function(handler, data) {
    db.status.getStatus(db, handler, data);
  },
  updateStatus: function(handler, data) {
    db.status.updateStatus(db, handler, data);
  },
  getLocation: function(handler, data) {
    db.status.getLocation(db, handler, data);
  },
  updateLocation: function(handler, data) {
    db.status.updateLocation(db, handler, data);
  }
};