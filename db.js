/** MongoDB connection for app */
const { DB_URI, DATABASE } = require("./config");

const mongoose = require("mongoose");

class Database {
  constructor() {
    this._connect(DB_URI);
  }

  _connect() {
    mongoose
      .connect(`${DB_URI}/${DATABASE}`, { useNewUrlParser: true })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch(err => {
        console.error(err.message);
        console.error("Database connection error");
      });
  }
}

module.export = new Database();
