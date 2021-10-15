// REPLACE WITH YOUR DESIRED DEAL STAGE ID AND PIPELINE ID
const DEAL_STAGE_ID = undefined;
const PIPELINE_ID = undefined;

const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  // Set up the HubSpot API Client
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });

  // Use the client to pull information relating to the currently enrolled deal
  hubspotClient.crm.deals.basicApi
    .getById(
      event.object.objectId,
      ['contract_length', 'amount', 'closedate', 'dealname']
    )
    .then(results => {

      // Store the appropriate data relating to the currently enrolled deal in variables.
      // contract_length is the length of the contract and dictates how many deals we will create.
      let contract_length = results.body.properties.contract_length;
      let amount = results.body.properties.amount;
      let closedate = results.body.properties.closedate;
      let dealname = results.body.properties.dealname;

      // Construct our request body
      let deals = [];
      for (let i = 1; i < contract_length; i++) {
        deals.push({
          properties: {
            amount,
            closedate,
            dealname: `MONTH ${i}: ${dealname}`,
            dealstage: DEAL_STAGE_ID,
            pipeline: PIPELINE_ID
          }
        });
      }

      // Make a request to batch create X deals
      hubspotClient.crm.deals.batchApi.create({
        inputs: deals
      });
    });
}
