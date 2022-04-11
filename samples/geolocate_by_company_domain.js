const hubspot = require('@hubspot/api-client');
const axios = require('axios');

const dns = require('dns');

const lookupPromise = url =>
  new Promise((resolve, reject) => {
    dns.lookup(url, (err, address, family) => {
      if (err) reject(err);
      resolve(address);
    });
  });

exports.main = async (event, callback) => {
  try {
    const companyDomain = event.inputFields.domain;

    if (!companyDomain)
      throw new Error(`company domain is undefined we got ${companyDomain}`);

    console.log(`the companyDomain is ${companyDomain}`);

    const ip = await lookupPromise(companyDomain);

    console.log(`ìp for ${companyDomain} is ${ip}`);

    const geoLoc = await axios.get(`http://ip-api.com/json/${ip}`);

    if (!geoLoc.data || geoLoc.data.status !== 'success')
      throw new Error(`We failed to geolocate ${ip}... 😬`);

    const serverLocation = `${geoLoc.data.city}, ${geoLoc.data.regionName}, ${geoLoc.data.country}`;

    if (!serverLocation)
      throw new Error(
        `We can't continue serverLocation is falsy we got ${serverLocation}... 😬`
      );

    const serverProvider = geoLoc.data.isp ? geoLoc.data.isp : '';

    const properties = {
      server_location: serverLocation,
      server_provider: serverProvider.toLowerCase(),
    };

    console.log(JSON.stringify(properties));

    callback({
      outputFields: {
        server_location: serverLocation,
        server_provider: serverProvider,
      },
    });
  } catch (err) {
    console.error(err);
    // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
    throw err;
  }
};
