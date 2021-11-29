// For instructions on how to use this snippet, see this guide:
// https://github.com/HubSpot/sample-workflow-custom-code/blob/main/guides/hubdb_table_lead_rotation.md
// Credit: Amine Ben Cheikh Brahim https://gist.github.com/AmineBENCHEIKHBRAHIM

const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  // Instantiate HubSpot API Client
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });

  // Store the postal code of the current contact enrolld in the workflow
  const postalCode = event.inputFields['zip'];

  // If the postal code value is not indicated, throw an error
  if (postalCode != null && postalCode != '') {
    console.log(`Found a zip code: ${postalCode}. Assignment in progress.`);
  } else {
    console.log('Contact doesn\'t have a zip code defined, no basis to assign a sales rep');
    throw new Error("Contact doesn't have a zip code");
  }

  // Get the email address of the assigned Account Executive to that postal
  // code by querying the HubDB table `postalcodeassociations`
  hubspotClient
    .apiRequest({
      method: 'GET',
      path: `/cms/v3/hubdb/tables/postalcodesassociations/rows?postal_code=` + postalCode,
      body: {}
    })
    .then(searchResult => {
      let salesRepsEmails = searchResult.body.results;

      if (salesRepsEmails.length == 0) {
        console.log('No matching sales rep');
        throw new Error('No matching sales rep');
      }

      let salesRepEmail = searchResult.body.results[0].values.sales_rep_email;
      console.log(`Sales rep email is ${salesRepEmail}`);

      // Get the ID of the HubSpot user having that email address
      hubspotClient.crm.owners.defaultApi
        .getPage(salesRepEmail, undefined, 1, false)
        .then(owners => {
          if (owners.body.results.length == 0) {
            console.log('No matching HubSpot user found');
            throw new Error("No matching HubSpot user found");
          }
          let ownerId = owners.body.results[0].id;

          console.log(`Sales rep owner ID is ${ownerId}`);

          callback({
            outputFields: {
              owner_id: ownerId
            }
          })
        });
    });
}
