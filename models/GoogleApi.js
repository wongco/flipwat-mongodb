const Tabletop = require('tabletop');
const { GOOGLE_SHEET_KEY } = require('../config');

/** Async function that returns a Promise */
function getGoogleSheetData() {
  return new Promise((resolve, reject) => {
    try {
      Tabletop.init({
        key: GOOGLE_SHEET_KEY,
        callback: data => {
          resolve(data);
        },
        simpleSheet: true
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = getGoogleSheetData;
