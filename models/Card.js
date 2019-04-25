const mongoose = require("mongoose");
const { MAX_GET_LIMIT } = require("../config");
const { categoryModel } = require("./Category");

const cardSchema = new mongoose.Schema({
  id: Number,
  question: String,
  answer: String,
  createdat: { type: Date, default: Date.now }
});

const cardModel = new mongoose.model("Card", cardSchema, "cards");

/** Card DB Model */
class Card {
  static async getCardDetails({ _id, question, answer, createdat }) {
    const categories = await categoryModel
      .find({
        cards: _id
      })
      .select("-cards -__v")
      .lean();
    return { id: _id, question, answer, categories, createdat };
  }

  /**
   * @description - gets list of cards from the database - latest to oldest
   * @property {number} limit - numer of items to limit to
   * @property {number} page - pagination option
   * @return {Promise <[ { id, question, answer, categories, createdat }, ... ]>}
   */
  static async getCards({ page = 0, limit = MAX_GET_LIMIT }) {
    const cards = await cardModel
      .find({})
      .skip(page)
      .limit(limit)
      .lean();

    const cardListPromises = cards.map(card => Card.getCardDetails(card));
    const cardList = await Promise.all(cardListPromises);
    return cardList;
  }

  /**
   * @description - gets random card from the database
   * @return {Promise <{ id, question, answer, createdat }>}
   */
  static async getRandomCard() {
    // Get a random entry
    const count = await cardModel.count();
    const random = Math.floor(Math.random() * count);
    const rawResult = await cardModel.findOne({}).skip(random);

    // if no results are found throw error
    if (rawResult.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    const { _id, question, answer, createdat } = rawResult;
    const card = Card.getCardDetails({ id: _id, question, answer, createdat });
    return card;
  }

  /**
   * @description - gets specific card from the database
   * @property { string } id - id of card
   * @return {Promise <{ id, text, createdat }>}
   */
  static async getCard(id) {
    const rawResult = await cardModel.findOne({ _id: id });

    // if no results are found throw error
    if (rawResult.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    const { _id, question, answer, createdat } = rawResult;
    const card = Card.getCardDetails({ id: _id, question, answer, createdat });
    return card;
  }

  /**
   * @description - add a card to the database
   * @param { object } arg - object representing first argument
   * @param { string } arg.question - question on card
   * @param { string } arg.answer - answer for question
   * @param { date } arg.createdat - date question was added
   * @return {Promise <{ id, text, createdat }>}
   */
  static async addCard({
    question,
    answer,
    categories = [],
    createdat = new Date()
  }) {
    const result = new cardModel({
      question,
      answer,
      createdat
    });
    await result.save();

    // if no results are found throw error
    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    return { id: result._id, question, answer, categories, createdat };
  }
}

module.exports = Card;
