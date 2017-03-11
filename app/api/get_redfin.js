'use strict';
import cheerio from "cheerio";
const Redfin = {};


Redfin.getEstimate = function (url) {
  return new Promise(function (resolve, reject) {
    fetch(url)
        .then(res => res.text())
        .catch(err => reject(err))
        .then(res => {
          const $ = cheerio.load(res);
          const estimated_price = $('.main-font').first().text();
          resolve(removeChars(estimated_price))
        })
  });
};

const removeChars = function (string) {
  return string.split('').filter(char => char !== '$' && char !== ',').join('')
};


module.exports = Redfin;