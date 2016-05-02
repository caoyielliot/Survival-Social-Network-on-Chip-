var path = require('path');

var development_config = {
  "db": {
    "driver": "sqlite3",
    "path": path.join(__dirname, '../db/ssnoc-dev.db')
  }
};

var deploy_config = {
  "db": {
    "driver": "sqlite3",
    "path": path.join(__dirname, '../db/ssnoc.db')
  }
}

var test_config = {
  "db": {
    "driver": "sqlite3",
    "path": path.join(__dirname, '../db/ssnoc-test.db')
  }
}

module.exports = {
  "dev": development_config,
  "deploy": deploy_config,
  "test": test_config,
  "default": development_config
}
