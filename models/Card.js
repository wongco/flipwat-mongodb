const mongoose = require("mongoose");
const { MAX_PHRASE_LIMIT } = require("../config");

const cardSchema = new mongoose.Schema({
  id: Number,
  question: String,
  answer: String,
  category: String,
  createdat: { type: Date, default: Date.now }
});

const cardModel = new mongoose.model("Card", cardSchema);

/** Card DB Model */
class Card {
  /**
   * @description - gets list of cards from the database - latest to oldest
   * @property {number} limit - numer of items to limit to
   * @property {number} page - pagination option
   * @return {Promise <[ { id, text, createdat }, ... ]>}
   */
  static async getCards({ page = 0, limit = MAX_PHRASE_LIMIT }) {
    const result = await cardModel
      .find({})
      .skip(page)
      .limit(limit);
    return result;
  }

  /**
   * @description - gets random card from the database
   * @return {Promise <{ id, text, createdat }>}
   */
  static async getRandomCard() {
    // Get a random entry
    const count = await cardModel.count();
    const random = Math.floor(Math.random() * count);
    const result = await cardModel.findOne({}).skip(random);

    // if no results are found throw error
    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }
    return result;
  }

  /**
   * @description - gets specific card from the database
   * @property {number} id - id number of card
   * @return {Promise <{ id, text, createdat }>}
   */
  static async getCard(id) {
    const result = await cardModel.findOne({ id: +id });

    // if no results are found throw error
    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }
    return result;
  }

  /**
   * @description - add a card to the database
   * @param { object } arg - object representing first argument
   * @param { integer } arg.id - id of card
   * @param { string } arg.question - question on card
   * @param { string } arg.answer - answer for question
   * @param { date } arg.createdat - date question was added
   * @return {Promise <{ id, text, createdat }>}
   */
  static async addCard({ id, question, answer, createdat = new Date() }) {
    const result = new cardModel({
      id,
      question,
      answer,
      createdat
    });
    await result.save();

    // if no results are found throw error
    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }
    return { id, question, answer, createdat };
  }
}

module.exports = Card;
