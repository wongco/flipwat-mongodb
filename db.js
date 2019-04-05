/** MongoDB connection for app */
const { DB_URI, DBTYPE } = require('./config');

// function to generate MongoDB Client - Consumed as a promise
function connect() {
  const { MongoClient } = require('mongodb');
  const { MONGODB } = require('./config');
  // returns a promise client of mongodb with specific url and database
  return MongoClient.connect(DB_URI, { useNewUrlParser: true }).then(client =>
    client.db(MONGODB)
  );
}

if (DBTYPE === 'MONGO') {
  /** MongoDB Database connection for app */
  module.exports = connect;
} else {
  /** PostgreSQL Database connection for app */
  const { Client } = require('pg');

  const client = new Client(DB_URI);

  client.connect();

  module.exports = client;
}
