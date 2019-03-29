// npm modules
const express = require('express');
const router = new express.Router();

// class models
const APIError = require('../models/ApiError');

/** Base Route: /cards */

/** GET - /cards
 * desc: get a list of cards
 */
router.get('/', async (req, res, next) => {
  return res.json({
    message: 'get'
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
