// npm modules
const express = require("express");
const router = new express.Router();

// class models
const APIError = require("../models/ApiError");
const Category = require("../models/Category");

/** Base Route: /categories */

/** GET - /categories
 * desc: get a list of categories
 */
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.getCategories({});
    return res.json({
      categories
    });
  } catch (err) {
    console.log(err);
    const error = new APIError("could not retreive categories", 500);
    return next(error);
  }
});

/** GET - /categories/random
 * desc: get a random category
 */
router.get("/random", async (req, res, next) => {
  try {
    const category = await Category.getRandomCategory();
    return res.json({
      category
    });
  } catch (err) {
    const error = new APIError("could not retreive categories", 500);
    return next(error);
  }
});

/** GET - /categories/:id
 * desc: get a specific category
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.getCategory(id);
    return res.json({
      category
    });
  } catch (err) {
    const error = new APIError("could not retrieve category!", 404);
    return next(error);
  }
});

/** POST - /categories
 * desc: add a category
 */
router.post("/", async (req, res, next) => {
  try {
    const { id, name } = req.body.category;
    const category = await Category.addCategory({
      id,
      name
    });
    return res.json({
      category
    });
  } catch (err) {
    const error = new APIError("could not add category!", 500);
    return next(error);
  }
});

/** PATCH - /categories/:id
 * desc: update a category
 */
router.patch("/:id", async (req, res, next) => {
  return res.json({
    message: "patch"
  });
});

/** DELETE - /categories/:id
 * desc: delete a category
 */
router.delete("/:id", async (req, res, next) => {
  return res.json({
    message: "delete"
  });
});

module.exports = router;
