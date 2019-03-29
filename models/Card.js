const db = require('../db');
const { MAX_PHRASE_LIMIT } = require('../config');

/** Card DB Model */
class Card {
  /**
   * @description - gets list of cards from the database - latest to oldest
   * @property {number} limit - numer of items to limit to
   * @property {number} page - pagination option
   * @return {Promise <[ { id, text, createdat }, ... ]>}
   */
  static async getCards({ page = 0, limit = MAX_PHRASE_LIMIT }) {
    const result = await db.query(
      'SELECT * FROM cards ORDER BY createdat DESC OFFSET $1 LIMIT $2',
      [page, limit]
    );
    return result.rows;
  }
}

module.exports = Card;
