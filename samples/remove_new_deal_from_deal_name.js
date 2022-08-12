// Credit: David Gutla https://github.com/gutla

// This code removes the '- new deal' text added to a deal name after it is created.
const TEXT_TO_REMOVE = ' - New Deal';

const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.secretName
  });

  const dealId = event.object.objectId;

  hubspotClient.crm.deals.basicApi.getById(dealId, ['dealname'])
    .then(dealResults => {
      let dealName = dealResults.body.properties.dealname;
      console.log(`Found deal name: ${dealName}`);

      // Remove dealNameText if it is found in the deal title.
      if (dealName.includes(TEXT_TO_REMOVE)) {
        dealName = dealName.replace(TEXT_TO_REMOVE, '')
        console.log(`Removing ${TEXT_TO_REMOVE} from deal name. New value: ${dealName}`);

        // Update deal name with the removed text
        hubspotClient.crm.deals.basicApi.update(dealId, {
          properties: {
            dealname: dealName,
          }
        });
      }
    });
};
