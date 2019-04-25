const mongoose = require("mongoose");
const { MAX_GET_LIMIT } = require("../config");
const { categoryModel } = require("./Category");

const cardSchema = new mongoose.Schema({
  id: Number,
  question: String,
  answer: String,
  category: String,
  createdat: { type: Date, default: Date.now }
});

const cardModel = new mongoose.model("Card", cardSchema, "cards");

/** Card DB Model */
class Card {
  /**
   * @description - gets list of cards from the database - latest to oldest
   * @property {number} limit - numer of items to limit to
   * @property {number} page - pagination option
   * @return {Promise <[ { id, text, createdat }, ... ]>}
   */
  static async getCards({ page = 0, limit = MAX_GET_LIMIT }) {
    const cards = await cardModel
      .find({})
      .skip(page)
      .limit(limit)
      .lean();

    // return cardsWithCategories;

    // const categoryPromises = cards.map(card => {
    //   return categoryModel
    //     .find({
    //       cards: card._id
    //     })
    //     .select("-cards -__v")
    //     .lean();
    // });

    // const categories = await Promise.all(categoryPromises);
    // const cardList = cards.map((card, idx) => {
    //   return { ...card, categories: categories[idx] };
    // });

    // return cardList;

    async function getCardDetails(card) {
      const categories = await categoryModel
        .find({
          cards: card._id
        })
        .select("-cards -__v")
        .lean();
      return { ...card, categories };
    }

    const cardListPromises = cards.map(card => getCardDetails(card));
    const cardList = await Promise.all(cardListPromises);
    return cardList;
  }

  /**
   * @description - gets random card from the database
   * @return {Promise <{ _id, text, createdat }>}
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
   * @property { string } _id - id of card
   * @return {Promise <{ id, text, createdat }>}
   */
  static async getCard(_id) {
    const result = await cardModel.findOne({ _id });

    // if no results are found throw error
    if (result.length === 0) {
      throw new Error("No entries exist in the database!");
    }
    return result;
  }

  /**
   * @description - add a card to the database
   * @param { object } arg - object representing first argument
   * @param { string } arg.question - question on card
   * @param { string } arg.answer - answer for question
   * @param { date } arg.createdat - date question was added
   * @return {Promise <{ id, text, createdat }>}
   */
  static async addCard({ question, answer, createdat = new Date() }) {
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
    return result;
  }
}

module.exports = Card;
