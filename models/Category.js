const mongoose = require("mongoose");
const { MAX_GET_LIMIT } = require("../config");

const categorySchema = new mongoose.Schema({
  name: String,
  createdt: { type: Date, default: Date.now },
  cards: [{ type: mongoose.Schema.ObjectId, ref: "Card" }]
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
   * @return {Promise <[ { id, name, cards, createdat }, ... ]>}
   */
  static async getCategories({ page = 0, limit = +MAX_GET_LIMIT }) {
    const results = await categoryModel
      .find({})
      .skip(page)
      .limit(limit)
      .populate("cards", "_id question answer createdat") // triggers lookup of ref data
      .lean();

    const cleanResults = results.map(rawCategory => {
      const { _id, name, cards, createdat } = rawCategory;
      return { id: _id, name, cards, createdat };
    });
    return cleanResults;
  }

  /**
   * @description - gets random category from the database
   * @return {Promise <{ id, name, cards, createdat }>}
   */
  static async getRandomCategory() {
    // Get a random entry
    const count = await categoryModel.count();
    const random = Math.floor(Math.random() * count);
    const result = await categoryModel
      .findOne({})
      .skip(random)
      .populate("cards", "_id question answer createdat")
      .lean();

    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    const { _id, name, cards, createdat } = result;
    return { id: _id, name, cards, createdat };
  }

  /**
   * @description - gets specific category from the database
   * @property { string } id - id of category
   * @return {Promise <{ id, name, cards, createdat }>}
   */
  static async getCategory(_id) {
    const result = await categoryModel
      .findOne({ _id })
      .populate("cards", "_id question answer createdat")
      .lean();

    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    const { name, cards, createdat } = result;
    return { id: _id, name, cards, createdat };
  }

  /**
   * @description - add a category to the database
   * @param { object } arg - object representing first argument
   * @param { integer } arg.id - id of Category
   * @param { string } arg.name - name of Category
   * @param { array } arg.cards - list of card ids belonging to Category
   * @param { date } arg.createdat - date category was added
   * @return {Promise <{ id, name, cards, createdat }>}
   */
  static async addCategory({ name, cards = [], createdat = new Date() }) {
    const result = new categoryModel({
      name,
      createdat,
      cards
    });
    await result.save();

    return { id: result._id, name, cards, createdat };
  }
}

module.exports = { Category, categoryModel };
