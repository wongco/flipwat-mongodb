/** Common config */

// read .env files and make environmental variables
require('dotenv').config();

// pull db uri from .env or actual ENV
let DB_URI = process.env.DATABASE_URL || 'postgresql:///flipwat';

// if test environment is active, optimize for performance and convenience
if (process.env.NODE_ENV === 'test') {
  DB_URI = 'postgresql:///flipwat-test';
}

const SECRET_KEY = process.env.SECRET_KEY || 'test-env-secret';
const PORT = process.env.PORT || 5000;

module.exports = {
  SECRET_KEY,
  DB_URI,
  PORT
};
