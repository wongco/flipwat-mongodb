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
    const cards = await Card.getCards({});
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

/** GET - /cards/update
 * desc: update postgreSQL from Google Doc
 */
// router.get('/update', async (req, res, next) => {
//   try {
//     const googleData = await getGoogleSheetData();
//     const { data } = googleData;
//     // await Card.replaceDatabase(data);
//     return res.json({
//       data
//     });
//   } catch (err) {
//     const error = new APIError('could not update from GoogleAPI', 500);
//     return next(error);
//   }
// });

/** GET - /cards/:id
 * desc: get a specific card
 */
router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const card = await Card.getCard(_id);
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
router.patch("/:_id", async (req, res, next) => {
  return res.json({
    message: "patch"
  });
});

/** DELETE - /cards/:id
 * desc: delete a card
 */
router.delete("/:_id", async (req, res, next) => {
  return res.json({
    message: "delete"
  });
});

module.exports = router;
