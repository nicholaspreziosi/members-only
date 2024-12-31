const { Pool } = require("pg");
require("dotenv").config();

// All of the following properties should be read from environment variables
module.exports = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});
