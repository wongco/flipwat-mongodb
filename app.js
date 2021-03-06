/** Express app */
const express = require("express");
const app = express();
const cors = require("cors");
const { connectToDatabase } = require("./db"); // initialize mongodb

//initalize mongoDB
connectToDatabase();

// don't provide http logging during automated tests
if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "production") {
  // middleware for logging HTTP requests to console
  const morgan = require("morgan");
  app.use(morgan("tiny"));
}

// class models
const APIError = require("./models/ApiError");

// routes
const cardRoutes = require("./routes/cards");
const categoryRoutes = require("./routes/categories");

// middleware for parsing req.body and json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
// routing control - users route
app.use("/cards", cardRoutes);
app.use("/categories", categoryRoutes);

/** 404 handler */
app.use(function(req, res, next) {
  const err = new APIError(`${req.url} is not a valid path to a API resource.`);
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */
app.use(function(err, req, res, next) {
  // all errors that get to here get coerced into API Errors
  if (!(err instanceof APIError)) {
    err = new APIError(err.message, err.status);
  }
  return res.status(err.status).json(err);
});

module.exports = app;
