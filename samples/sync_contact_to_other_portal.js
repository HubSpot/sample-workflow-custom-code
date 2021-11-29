// For instructions on how to use this snippet, see this guide:
// https://github.com/HubSpot/sample-workflow-custom-code/blob/main/guides/sync_contact_to_other_portal.md
// Credit: Amine Ben Cheikh Brahim https://gist.github.com/AmineBENCHEIKHBRAHIM

const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  // Instantiate HubSpot Client that will be used to interface with Source Portal (Portal A)
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });

  // Instantiate HubSpot Client that will be used to interface with Destination Portal (Portal B)
  const hubspotClient2 = new hubspot.Client({
    apiKey: process.env.TESTPORTALKEY
  });

  // Store the contact properties to sync in variables
  hubspotClient.crm.contacts.basicApi
    .getById(
      event.object.objectId,
      ['email', 'firstname', 'lastname', 'phone', 'hubspot_owner_id']
    )
    .then(contact => {
      let email = contact.body.properties.email;
      let phone = contact.body.properties.phone;
      let firstname = contact.body.properties.firstname;
      let lastname = contact.body.properties.lastname;
      let hubspot_owner_id = contact.body.properties.hubspot_owner_id;

      // Here we assume we would like to assign the same owner in Portal A to the
      // copied contact in Portal B and that the owner is a user in both portal A
      // and portal B. For example, if john.doe@hubspot.com is a user in Portal A
      // and is the owner of the source contact. We would like to assign him as an
      // owner of the destination contact in portal B.

      // Get owner email in Portal A
      hubspotClient.crm.owners.defaultApi
        .getById(hubspot_owner_id, 'id', false)
        .then(owners1 => {
          let ownerEmail = owners1.body.email;
          console.log("original owner ID = " + hubspot_owner_id);
          console.log("owner Email = " + ownerEmail);

          // Get the owner ID corresponding to that email in portal B (Because a
          // user even though with the same email, will have a different owner ID
          // in each portal)
          hubspotClient2.crm.owners.defaultApi
            .getPage(ownerEmail, undefined, 1, false)
            .then(owners2 => {
              let ownerId = owners2.body.results[0].id;
              console.log("total = " + owners2.body.total);
              console.log(JSON.stringify(owners2.body, null, 2));
              console.log("destination owner ID = " + ownerId);

              // Create the contact in portal B and assign the owner to it
              hubspotClient2.crm.contacts.basicApi.create({
                "properties": {
                  "email": email,
                  "phone": phone,
                  "firstname": firstname,
                  "lastname": lastname,
                  "hubspot_owner_id": ownerId
                }
              });
            });
        });
    });
}
