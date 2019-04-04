/** PostgreSQL Commented out to test MongoDB Connection */
/** PostgreSQL Database connection for app */

// const { Client } = require('pg');
// const { DB_URI } = require('./config');

// const client = new Client(DB_URI);

// client.connect();

// module.exports = client;

/** MongoDB connection for app */
const MongoClient = require('mongodb').MongoClient;
const { MONGODB_URI, MONGODB } = require('./config');

// setup mongo connection criteria
const mongo = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true
});

let db;
// setup database connection and assign db correct mongodb instance
mongo.connect(error => {
  if (error) {
    // kill express if cannot connect to db server
    console.error(error);
    process.exit(1);
  }

  console.log('Successfully connected to database');
  // initialize db with mongo database instance
  db = mongo.db(MONGODB);
});

module.exports = db;
