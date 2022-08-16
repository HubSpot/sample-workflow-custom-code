// For instructions on how to use this snippet, see this guide:
// https://github.com/HubSpot/sample-workflow-custom-code/blob/main/guides/create_renewal_deal_and_associate_with_company.md
// Credit: Amine Ben Cheikh Brahim https://gist.github.com/AmineBENCHEIKHBRAHIM

const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.secretName
  });

  // Retrieving the properties of the deal to renew
  // The properties should be specified in the "Property to include in code" section above the code editor.
  // The properties deal_length (in days) and deal_discount (in percentage) should be specified as custom properties on the deal record
  const amount = event.inputFields['amount'];
  const deal_length = Number(event.inputFields['deal_length']);
  const deal_discount = event.inputFields['deal_discount'];
  const dealname = event.inputFields['dealname'];
  const closedate = event.inputFields['closedate'];

  // If discount and deal length and deal amount values are not indicated, throw an error
  if (amount != null && deal_length != null && deal_discount != null) {
    console.log(
      `discount and deal length and deal amount values are indicated: Renewal deal creation in progress.`
    );
  } else {
    console.log('discount or deal length or deal amount values are not specified');
    throw new Error("discount or deal length or deal amount values are not specified");
  }

  // Calculate the discount to be applied on the new renewal deal. Here we apply 10% less discount in comparaison to the original deal but feel free to use your own formula.
  // If the discount value is negative original discount is less than 10%, the new discount value will be set to 0
  var new_deal_discount = deal_discount - 10;
  if (new_deal_discount < 0) {
    new_deal_discount = 0;
  }

  // Calculate the new deal amount after new discount is applied
  const new_amount = (((amount * 100) / (100 - deal_discount)) * (100 - new_deal_discount)) / 100;

  // Convert original deal close date unixtimestamp to a number 
  const unixTimeZero = Number(closedate);

  // Add the deal length in days to the original deal close date to get the renewal deal close date
  const newtimestamp = unixTimeZero + deal_length * 1000 * 60 * 60 * 24;

  // Get the ID of the primary company associated to the deal   
  hubspotClient.crm.deals.associationsApi
    .getAll(event.object.objectId, 'company')
    .then(results => {
      if (results.body.results.length == 0) {
        console.log("The Deal doesn't have any associated companies");
        return;
      }

      let companyId = results.body.results[0].id;
      console.log(`The deals's associated company ID is ${companyId}`);

      // Define the properties of the renewal deal         
      const properties = {
        "amount": new_amount, // Renewal Deal new amount after new discount is applied
        "closedate": newtimestamp, // Renewal Deal new close date by adding deal length to the original deal close date
        "dealname": dealname + " - Renewal", // Renewal Deal new name by adding - Renewal to the original deal name
        "dealstage": 12260673, // Renewal Deal stage
        "deal_discount": new_deal_discount, // Renewal deal new discount value
        "deal_length": deal_length, // Renewal deal new length. By default, same length as the original deal
        "hubspot_owner_id": "49141072", // Renewal deal owner. The value used here is the ID of the CSM responsible for renewal. You'll use your own value generated in your portal
        "pipeline": 3630085 // Renewal Deal pipeline. The value used here is the ID of the renewal pipeline. You'll use your own value generated in your portal
      };
      const SimplePublicObjectInput = {
        properties
      };

      // Create the renewal deal
      hubspotClient.crm.deals.basicApi.create(SimplePublicObjectInput).then(DealCreateResponse => {
        // Associate the same company associated to the original deal, to the renewal deal
        hubspotClient.crm.companies.associationsApi.create(companyId, 'deals', DealCreateResponse
          .body.id, 'company_to_deal');

      });
    });
}
