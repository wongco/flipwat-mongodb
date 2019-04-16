/** Common config */

// read .env files and make environmental variables
require("dotenv").config();

const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017"; // mongodb or postgres database uri
const DATABASE = "cards_db";
const PORT = process.env.PORT || 5000;
const MAX_GET_LIMIT = process.env.MAX_GET_LIMIT || 25;
const GOOGLE_SHEET_KEY = process.env.GOOGLE_SHEET_KEY;

module.exports = {
  MONGODB_URI,
  PORT,
  MAX_GET_LIMIT,
  GOOGLE_SHEET_KEY,
  DATABASE
};
