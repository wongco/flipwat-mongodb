const db = require('../db');
const { MAX_PHRASE_LIMIT } = require('../config');
const { DBTYPE } = require('../config');

let client;
// initailizes mongoDB from Promise instance if DBType is Mongo
if (DBTYPE === 'MONGO') {
  db().then(resultClient => {
    client = resultClient;
    console.log('Successfully connected to MongoDB database');
  });
}

/** Card DB Model */
class Card {
  /**
   * @description - gets list of cards from the database - latest to oldest
   * @property {number} limit - numer of items to limit to
   * @property {number} page - pagination option
   * @return {Promise <[ { id, text, createdat }, ... ]>}
   */
  static async getCards({ page = 0, limit = MAX_PHRASE_LIMIT }) {
    // mongoDB Utilization
    if (DBTYPE === 'MONGO') {
      const result = await client
        .collection('cards')
        .find()
        .skip(page)
        .limit(limit)
        .toArray();
      return result;
    }

    // POSTGRES DB Utilization
    const result = await db.query(
      'SELECT * FROM cards ORDER BY createdat DESC OFFSET $1 LIMIT $2',
      [page, limit]
    );

    return result.rows;
  }

  /**
   * @description - gets list of cards from the database - latest to oldest
   * @property {number} limit - numer of items to limit to
   * @property {number} page - pagination option
   * @return {Promise <{ id, text, createdat }>}
   */
  static async getRandomCard() {
    // mongoDB Utilization
    if (DBTYPE === 'MONGO') {
      const result = await client
        .collection('cards')
        .aggregate([{ $sample: { size: 1 } }])
        .toArray();

      // if no results are found throw error
      if (result.length === 0) {
        throw new Error('No entries exist in the database!');
      }
      return result[0];
    }

    // POSTGRES DB Utilization
    const result = await db.query(
      'SELECT * FROM cards ORDER BY RANDOM() LIMIT 1'
    );
    if (result.length === 0) {
      throw new Error('No entries exist in the database!');
    }
    return result.rows[0];
  }

  /**
   * @description - gets specific card from the database
   * @property {number} id - id number of card
   * @return {Promise <{ id, text, createdat }>}
   */
  static async getCard(id) {
    // mongoDB Utilization
    if (DBTYPE === 'MONGO') {
      const result = await client
        .collection('cards')
        .find({ id: +id }) // serial id needs coercion
        .toArray();

      // if no results are found throw error
      if (result.length === 0) {
        throw new Error('Could not find specified id');
      }
      return result[0];
    }

    // POSTGRES DB Utilization
    const result = await db.query('SELECT * FROM cards WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Could not find specified id');
    }
    return result.rows[0];
  }
}

module.exports = Card;
