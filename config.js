/** Common config */

// read .env files and make environmental variables
require('dotenv').config();

// check if DBType is POSTGRES or MONGO in env variable DBTYPE
const DBTYPE = process.env.DBTYPE || 'POSTGRES';

let DB_URI; // mongodb or postgres database uri
let MONGODB; // mongodb database name

if (DBTYPE === 'MONGO') {
  // DB Selection is MonogoDB
  DB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017';
  MONGODB = process.env.MONGODB || 'cards_db';
} else {
  // DB Selection is PostgreSQL

  // pull db uri from .env or actual ENV
  DB_URI = process.env.DATABASE_URL || 'postgresql:///flipwat';

  // if test environment is active, optimize for performance and convenience
  if (process.env.NODE_ENV === 'test') {
    DB_URI = 'postgresql:///flipwat-test';
  }
}

const PORT = process.env.PORT || 5000;
const MAX_PHRASE_LIMIT = process.env.MAX_PHRASE_LIMIT || 25;
const GOOGLE_SHEET_KEY = process.env.GOOGLE_SHEET_KEY;

module.exports = {
  DB_URI,
  PORT,
  MAX_PHRASE_LIMIT,
  GOOGLE_SHEET_KEY,
  MONGODB,
  DBTYPE
};
