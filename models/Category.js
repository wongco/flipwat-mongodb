const mongoose = require("mongoose");
const { MAX_GET_LIMIT } = require("../config");

const categorySchema = new mongoose.Schema({
  name: String,
  cards: [{ type: mongoose.Schema.ObjectId, ref: "Card" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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
   * @return {Promise <[ { id, name, cards, createdAt, updatedAt }, ... ]>}
   */
  static async getCategories({ page = 0, limit = +MAX_GET_LIMIT }) {
    const results = await categoryModel
      .find({})
      .skip(page)
      .limit(limit)
      .populate("cards", "_id question answer createdAt updatedAt") // triggers lookup of ref data
      .lean();

    const cleanCategories = results.map(rawCategory => {
      const { _id, name, cards, createdAt, updatedAt } = rawCategory;

      const cleanCards = cards.map(card => {
        const { _id, question, answer, createdAt, updatedAt } = card;
        return { id: _id, question, answer, createdAt, updatedAt };
      });

      return { id: _id, name, cards: cleanCards, createdAt, updatedAt };
    });

    return cleanCategories;
  }

  /**
   * @description - gets random category from the database
   * @return {Promise <{ id, name, cards, createdAt, updatedAt }>}
   */
  static async getRandomCategory() {
    // Get a random entry
    const count = await categoryModel.count();
    const random = Math.floor(Math.random() * count);
    const categoryDocument = await categoryModel
      .findOne({})
      .skip(random)
      .populate("cards", "_id question answer createdAt updatedAt")
      .lean();

    if (categoryDocument.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    const { _id, name, cards, createdAt, updatedAt } = categoryDocument;
    return { id: _id, name, cards, createdAt, updatedAt };
  }

  /**
   * @description - gets specific category from the database
   * @property { string } id - id of category
   * @return {Promise <{ id, name, cards, createdAt, updatedAt }>}
   */
  static async getCategory(id) {
    const categoryDocument = await categoryModel
      .findOne({ _id: id })
      .populate("cards", "_id question answer createdAt updatedAt")
      .lean();

    if (categoryDocument.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    const { name, cards, createdAt, updatedAt } = categoryDocument;
    const cleanCards = cards.map(card => {
      const { _id, question, answer, createdAt, updatedAt } = card;
      return { id: _id, question, answer, createdAt, updatedAt };
    });
    return { id, name, cards: cleanCards, createdAt, updatedAt };
  }

  /**
   * @description - add a category to the database
   * @param { object } arg - object representing first argument
   * @param { integer } arg.id - id of Category
   * @param { string } arg.name - name of Category
   * @param { array } arg.cards - list of card ids belonging to Category
   * @param { date } arg.createdAt - date category was added
   * @param { date } arg.updatedAt - date category was updated
   * @return {Promise <{ id, name, cards, createdAt, updatedAt }>}
   */
  static async addCategory({
    name,
    cards = [],
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    const newCategoryDocument = new categoryModel({
      name,
      createdAt,
      updatedAt,
      cards
    });
    await newCategoryDocument.save();

    return { id: newCategoryDocument._id, name, cards, createdAt, updatedAt };
  }

  /**
   * @description - update a category in the database
   * @param { object } arg - object representing first argument
   * @param { integer } arg.id - id of Category
   * @param { string } arg.name - name of Category
   * @return {Promise <{ id, name, cards, createdAt }>}
   */
  static async updateCategory({ id, name }) {
    const categoryDocument = await categoryModel.findOne({ _id: id });

    if (categoryDocument.length === 0) {
      throw new Error("No entry exists in the database!");
    }

    const updatedAt = new Date();
    categoryDocument.name = name;
    categoryDocument.updatedAt = updatedAt;
    await categoryDocument.save();

    const { createdAt } = categoryDocument;
    return { id, name, createdAt, updatedAt };
  }

  /**
   * @description - delete a category in the database
   * @param { integer } id - id of Category
   * @return { integer } id of deleted Category
   */
  static async deleteCategory(id) {
    await categoryModel.deleteOne({ _id: id });
  }
}

module.exports = { Category, categoryModel };
