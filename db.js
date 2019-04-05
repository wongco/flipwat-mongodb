/** PostgreSQL Commented out to test MongoDB Connection */
/** PostgreSQL Database connection for app */

// const { Client } = require('pg');
// const { DB_URI } = require('./config');

// const client = new Client(DB_URI);

// client.connect();

// module.exports = client;

/** MongoDB connection for app */
const { MongoClient } = require('mongodb');
const { MONGODB_URI, MONGODB } = require('./config');

function connect() {
  // returns a promise client of mongodb with specific url and database
  return MongoClient.connect(MONGODB_URI, { useNewUrlParser: true }).then(
    client => client.db(MONGODB)
  );
}

module.exports = connect;
