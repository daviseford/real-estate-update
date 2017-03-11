'use strict';
const zwsId = require('./zillow_key'); // The Zillow Web Service Identifier.
const {parseString} = require('xml2js');
const Zillow = {};

/**
 *
 * @param address - The address of the property to search. This string should be URL encoded.
 * @param zip - The city+state combination and/or ZIP code for which to search. This string should be URL encoded.
 * Note that giving both city and state is required. Using just one will not work.
 *
 * @returns {Promise}
 */
Zillow.getProperty = function (address, zip) {
  return new Promise(function (pOk, pErr) {

    address = encodeURIComponent(address);
    const params = `zws-id=${zwsId}&address=${address}&citystatezip=${zip}`;
    const endpoint = `http://www.zillow.com/webservice/GetDeepSearchResults.htm?`;

    fetch(`${endpoint}${params}`)
        .then(res => res.text())
        .catch(err => pErr(err))
        .then(res => {
          parseString(res, (err, result) => {
            if (err) return pErr(err);
            const results = result["SearchResults:searchresults"].response[0].results[0].result[0];
            pOk(results);
          })
        })
        .catch(err => {
          pErr(err);
        })
  })
};


/**
 *
 * @param zpid - The Zillow Property ID for the property for which to obtain information. (int)
 * @param rent - Return Rent Zestimate information if available (boolean true/false, default: false)
 * @returns {Promise}
 */
Zillow.getZestimate = function (zpid, rent = false) {
  return new Promise(function (resolve, reject) {
    const params = `zws-id=${zwsId}&zpid=${zpid}&rentzestimate=${rent}`;
    const endpoint = `http://www.zillow.com/webservice/GetZestimate.htm?`;

    fetch(`${endpoint}${params}`)
        .then(res => res.text())
        .catch(err => reject(err))
        .then(res => {
          parseString(res, (err, result) => {
            if (err) return reject(err);
            const results = result["Zestimate:zestimate"].response[0];
            resolve(results);
          })
        })
        .catch(err => {
          reject(err);
        })

  });
};


module.exports = Zillow;