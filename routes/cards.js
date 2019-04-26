const { MAX_GET_LIMIT } = require("../config");

// npm modules
const express = require("express");
const router = new express.Router();

// class models
const APIError = require("../models/ApiError");
const Card = require("../models/Card");

/** Base Route: /cards */

/** GET - /cards
 * desc: get a list of cards
 */
router.get("/", async (req, res, next) => {
  try {
    const { limit = MAX_GET_LIMIT, page = 0 } = req.query;
    const cards = await Card.getCards({
      page: +page,
      limit: +limit
    });
    return res.json({
      cards
    });
  } catch (err) {
    console.log(err);
    const error = new APIError("could not retreive cards", 500);
    return next(error);
  }
});

/** GET - /cards/random
 * desc: get a random card
 */
router.get("/random", async (req, res, next) => {
  try {
    const card = await Card.getRandomCard();
    return res.json({
      card
    });
  } catch (err) {
    const error = new APIError("could not retreive card", 500);
    return next(error);
  }
});

/** GET - /cards/:id
 * desc: get a specific card
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.getCard(id);
    return res.json({
      card
    });
  } catch (err) {
    const error = new APIError("could not retrieve card!", 404);
    return next(error);
  }
});

/** POST - /cards
 * desc: add a card
 */
router.post("/", async (req, res, next) => {
  try {
    const { question, answer, createdat } = req.body.card;
    const card = await Card.addCard({ question, answer, createdat });
    return res.json({
      card
    });
  } catch (err) {
    const error = new APIError("could not add card!", 500);
    return next(error);
  }
});

/** PATCH - /cards/:id
 * desc: update a card
 */
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body.card;
    const card = await Card.updateCard({ id, question, answer });
    return res.json({
      card
    });
  } catch (err) {
    const error = new APIError("could not update card!", 500);
    return next(error);
  }
});

/** DELETE - /cards/:id
 * desc: delete a card
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Card.deleteCard(id);
    return res.json({
      message: `Card successfully deleted.`
    });
  } catch (err) {
    const error = new APIError("could not delete card!", 500);
    return next(error);
  }
});

/** POST - /cards/:cardid/category/:categoryid
 * desc: add a card to a specific category
 */
router.post("/:cardId/category/:categoryId", async (req, res, next) => {
  try {
    const { cardId, categoryId } = req.params;
    const card = await Card.addCardToCategory({ cardId, categoryId });
    return res.json({
      card
    });
  } catch (err) {
    const error = new APIError("could not add card to category!", 500);
    return next(error);
  }
});

module.exports = router;
