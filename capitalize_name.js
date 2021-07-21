/**
 * Capitalizes the first letter of every part of a contact's first and last name.
 *
 * Examples:
 * - angus -> Angus
 * - ANGUS A. -> Angus A.
 * - O'connor -> O'Connor
 */
const FIRSTNAME_PROP = "firstname";
const LASTNAME_PROP = "lastname";

const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  callback(processEvent(event));
};

function processEvent(event) {
  const hubspotClient = new hubspot.Client({ apiKey: process.env.HAPIKEY });
  
  let contactId = event.object.objectId;
  
  hubspotClient.crm.contacts.basicApi
    .getById(contactId, [FIRSTNAME_PROP, LASTNAME_PROP])
    .then(results => {
      let firstname = results.body.properties[FIRSTNAME_PROP];
      let lastname = results.body.properties[LASTNAME_PROP];

      hubspotClient.crm.contacts.basicApi
        .update(
          contactId,
          {
            properties: {
              [FIRSTNAME_PROP]: capitalizeName(firstname),
              [LASTNAME_PROP]: capitalizeName(lastname)
            }
          }
        )
        .then(updateResults => null);
    });
}

function capitalizeName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\b(\w)/g, s => s.toUpperCase());
}