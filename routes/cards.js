// npm modules
const express = require('express');
const router = new express.Router();

// class models
const APIError = require('../models/ApiError');
const Card = require('../models/Card');

/** Base Route: /cards */

/** GET - /cards
 * desc: get a list of cards
 */
router.get('/', async (req, res, next) => {
  const cards = await Card.getCards({});
  return res.json({
    cards
  });
});

/** GET - /cards
 * desc: get a list of cards
 */
router.get('/random', async (req, res, next) => {
  const card = await Card.getRandomCard();
  return res.json({
    card
  });
});

/** POST - /cards/:id
 * desc: add a card
 */
router.post('/:id', async (req, res, next) => {
  return res.json({
    message: 'post'
  });
});

/** PATCH - /cards/:id
 * desc: update a card
 */
router.patch('/:id', async (req, res, next) => {
  return res.json({
    message: 'patch'
  });
});

/** DELETE - /cards/:id
 * desc: delete a card
 */
router.delete('/:id', async (req, res, next) => {
  return res.json({
    message: 'delete'
  });
});

module.exports = router;
