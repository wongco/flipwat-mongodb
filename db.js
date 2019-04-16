/** MongoDB connection for app */
const { MONGODB_URI, DATABASE } = require("./config");

const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(`${MONGODB_URI}/${DATABASE}`, {
      useNewUrlParser: true
    });
    console.log("Database connection successful");
  } catch (error) {
    console.error(error.message);
    console.error("Database connection error");
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
