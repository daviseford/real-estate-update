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

    const params = `zws-id=${zwsId}&address=${encodeURIComponent(address)}&citystatezip=${zip}`;
    const endpoint = `http://www.zillow.com/webservice/GetDeepSearchResults.htm?`;

    fetch(`${endpoint}${params}`)
        .then(res => res.text())
        .catch(err => pErr(err))
        .then(res => {
          parseString(res, (err, result) => {
            if (err) return pErr(err);
            if (!result["SearchResults:searchresults"].response) return pErr(new Error('No response from Zillow'));
            const results = result["SearchResults:searchresults"].response[0].results[0].result[0];
            console.log(results);
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
            if (!result["Zestimate:zestimate"].response) return reject(new Error('No response from Zestimate'));
            const results = result["Zestimate:zestimate"].response[0];
            resolve(results);
          })
        })
        .catch(err => {
          reject(err);
        })

  });
};

/**
 * Special async function to handle the whole process
 * @param address
 * @param zip
 * @returns {Promise.<void>}
 */
Zillow.getZestimateFromProperty = async function (address, zip) {
  try {
    // Grab propertyObj first, we'll need the zpid from here
    const propertyObj = await Zillow.getProperty(address, zip);
    const zpid = propertyObj.zpid[0];
    const last_sold_value = parseInt(propertyObj.lastSoldPrice[0]._);
    const last_sold_date = propertyObj.lastSoldDate[0];

    const zestimateObj = await Zillow.getZestimate(zpid);
    const zillow_value = parseInt(zestimateObj.zestimate[0].amount[0]._);

    return {
      last_sold_date,
      last_sold_value,
      zillow_value,
      zpid,
    }
  } catch (e) {
    console.log('Error fetching Zillow', e);
  }
};


module.exports = Zillow;