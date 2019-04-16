const mongoose = require("mongoose");
const { MAX_GET_LIMIT } = require("../config");

const categorySchema = new mongoose.Schema({
  id: Number,
  name: String,
  createdat: { type: Date, default: Date.now }
});

const categoryModel = new mongoose.model(
  "Category",
  categorySchema,
  "categories"
);

/** Category DB Model */
class Category {
  /**
   * @description - gets list of categories from the database
   * @property {number} limit - numer of items to limit to
   * @property {number} page - pagination option
   * @return {Promise <[ { id, name, createdat }, ... ]>}
   */
  static async getCategories({ page = 0, limit = MAX_GET_LIMIT }) {
    const result = await categoryModel
      .find({})
      .skip(page)
      .limit(limit);
    return result;
  }

  /**
   * @description - gets random category from the database
   * @return {Promise <{ id, text, createdat }>}
   */
  static async getRandomCategory() {
    // Get a random entry
    const count = await categoryModel.count();
    const random = Math.floor(Math.random() * count);
    const result = await categoryModel.findOne({}).skip(random);

    // if no results are found throw error
    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }
    return result;
  }

  /**
   * @description - gets specific category from the database
   * @property {number} id - id number of card
   * @return {Promise <{ id, text, createdat }>}
   */
  static async getCategory(id) {
    const result = await categoryModel.findOne({ id: +id });

    // if no results are found throw error
    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }
    return result;
  }

  /**
   * @description - add a category to the database
   * @param { object } arg - object representing first argument
   * @param { integer } arg.id - id of Category
   * @param { string } arg.name - name of Category
   * @param { date } arg.createdat - date category was added
   * @return {Promise <{ id, name, createdat }>}
   */
  static async addCategory({ id, name, createdat = new Date() }) {
    const result = new categoryModel({
      id,
      name,
      createdat
    });
    await result.save();

    return { id, name, createdat };
  }
}

module.exports = Category;
