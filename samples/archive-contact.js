/**
 * For a detailed write up on the use cases for this snippet, see
 * https://docs.google.com/document/d/15WA0YBX29ZUE3tdUCu7VnnXaC3A2OaIy4iv7I-snytE/edit?usp=sharing
 */
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
