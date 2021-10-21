const hubspot = require('@hubspot/api-client')

exports.main = (event) => {
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });

  // Archive a contact by ID
  hubspotClient.crm.contacts.basicApi.archive(event.object.objectId)
    .then(resp => {
      console.log('Contact archived')
    });
};
