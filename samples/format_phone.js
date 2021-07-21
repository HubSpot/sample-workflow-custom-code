/**
 * Transforms a 10-digit U.S. phone number into a standard format.
 */
const PHONE_NUMBER_PROP = "phone";

const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  callback(processEvent(event));
};

function processEvent(event) {
  const hubspotClient = new hubspot.Client({ apiKey: process.env.HAPIKEY });
  
  let contactId = event.object.objectId;
  
  hubspotClient.crm.contacts.basicApi
    .getById(contactId, [PHONE_NUMBER_PROP])
    .then(results => {
      let phone = results.body.properties[PHONE_NUMBER_PROP];

      hubspotClient.crm.contacts.basicApi
        .update(
          contactId,
          {
            properties: {
              [PHONE_NUMBER_PROP]: formatPhoneNumber(phone)
            }
          }
        )
        .then(updateResults => null);
    });
}

function formatPhoneNumber(phoneNumber) {
  let cleaned = phoneNumber.replace(/\D/g, '').trim();
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    // Format as (XXX) XXX-XXXX
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    
    // Alternatives (match[1] is the first three digits,
    // match[2] is the second three, match[3] is the last four):
    // - XXX-XXX-XXXX
    //   return match[1] + '-' + match[2] + '-' + match[3];
  }
  return phoneNumber;
}