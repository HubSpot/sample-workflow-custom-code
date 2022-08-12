const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.secretName
  });

  hubspotClient.crm.contacts.associationsApi
    .getAll(event.object.objectId, 'company')
    .then(results => {
      if (results.body.results.length == 0) {
        console.log("Contact doesn't have any associated companies");
        return;
      }

      let companyId = results.body.results[0].id;
      console.log(`The contact's associated company ID is ${companyId}`);

      hubspotClient.crm.contacts.associationsApi
        .getAll(event.object.objectId, 'deal')
        .then(results => {
          let associatedDealIds = results.body.results.map(deal => deal.id);
          console.log(`The contact's associated deal IDs are ${associatedDealIds.join(', ')}`);

          let batchInput = createBatchBody(companyId, associatedDealIds);
          hubspotClient.crm.associations.batchApi
            .create('deal', 'company', batchInput)
            .then(result => console.log(`Associated ${associatedDealIds.length} deals with the associated company`));
        });
    });
};

function createBatchBody(companyId, dealIds) {
  return {
    inputs: dealIds.map(dealId => {
      return {
        from: {
          id: dealId
        },
        to: {
          id: companyId
        },
        type: 'deal_to_company'
      };
    })
  };
}
