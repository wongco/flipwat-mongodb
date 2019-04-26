const mongoose = require("mongoose");
const { MAX_GET_LIMIT } = require("../config");
const { categoryModel } = require("./Category");

const cardSchema = new mongoose.Schema({
  id: Number,
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const cardModel = new mongoose.model("Card", cardSchema, "cards");

/** Card DB Model */
class Card {
  static async getCardDetails({ _id, question, answer, createdAt, updatedAt }) {
    const rawCategories = await categoryModel
      .find({
        cards: _id
      })
      .select("-cards -__v -id")
      .lean();

    const categories = rawCategories.map(category => {
      const { _id, name, createdAt, updatedAt } = category;
      return { id: _id, name, createdAt, updatedAt };
    });

    return { id: _id, question, answer, categories, createdAt, updatedAt };
  }

  /**
   * @description - gets list of cards from the database - latest to oldest
   * @property {number} limit - numer of items to limit to
   * @property {number} page - pagination option
   * @return {Promise <[ { id, question, answer, categories, createdAt, updatedAt }, ... ]>}
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
   * @return {Promise <{ id, question, answer, createdAt, updatedAt }>}
   */
  static async getRandomCard() {
    // Get a random entry
    const count = await cardModel.count();
    const random = Math.floor(Math.random() * count);
    const cardDocument = await cardModel
      .findOne({})
      .skip(random)
      .lean();

    // if no results are found throw error
    if (cardDocument.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    const card = Card.getCardDetails(cardDocument);
    return card;
  }

  /**
   * @description - gets specific card from the database
   * @property { string } id - id of card
   * @return {Promise <{ id, text, createdAt }>}
   */
  static async getCard(id) {
    const cardDocument = await cardModel.findOne({ _id: id }).lean();

    // if no results are found throw error
    if (cardDocument.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    const card = Card.getCardDetails(cardDocument);
    return card;
  }

  /**
   * @description - add a card to the database
   * @param { object } arg - object representing first argument
   * @param { string } arg.question - question on card
   * @param { string } arg.answer - answer for question
   * @param { date } arg.createdAt - date question was added
   * @return {Promise <{ id, text, createdAt, updatedAt }>}
   */
  static async addCard({
    question,
    answer,
    categories = [],
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    const cardDocument = new cardModel({
      question,
      answer,
      createdAt,
      updatedAt
    });
    await cardDocument.save();

    // if no results are found throw error
    if (cardDocument.length === 0) {
      throw new Error("No entries exist in the database!");
    }

    return {
      id: cardDocument._id,
      question,
      answer,
      categories,
      createdAt,
      updatedAt
    };
  }

  /**
   * @description - update card ib the database
   * @param { object } arg - object representing first argument
   * @param { integer } arg.id - id of card
   * @param { string } arg.question - question on card
   * @param { string } arg.answer - answer for question
   * @return {Promise <{ id, question, answer, createdAt, updatedAt }>}
   */
  static async updateCard({ id, question, answer }) {
    const cardDocument = await cardModel.findOne({ _id: id });

    if (cardDocument.length === 0) {
      throw new Error("No entry exists in the database!");
    }

    const updatedAt = new Date();
    cardDocument.question = question;
    cardDocument.answer = answer;
    cardDocument.updatedAt = updatedAt;
    await cardDocument.save();

    const { createdAt } = cardDocument;
    return { id, question, answer, createdAt, updatedAt };
  }

  /**
   * @description - delete a category in the database
   * @param { integer } id - id of Category
   * @return { integer } id of deleted Category
   */
  static async deleteCard(id) {
    await cardModel.deleteOne({ _id: id });
  }

  /**
   * @description - delete a category in the database
   * @param { integer } cardId - id of card
   * @param { integer } categoryId - id of Category
   */
  static async addCardToCategory({ cardId, categoryId }) {
    await categoryModel.findByIdAndUpdate(
      { _id: categoryId },
      { $addToSet: { cards: cardId } }
    );

    return await Card.getCard(cardId);
  }
}

module.exports = Card;
