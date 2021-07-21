/**
 * Transforms a date string into a standard format.
 */
const DATE_PROP = "createdate";

const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  callback(processEvent(event));
};

function processEvent(event) {
  const hubspotClient = new hubspot.Client({ apiKey: process.env.HAPIKEY });
  
  let contactId = event.object.objectId;
  
  hubspotClient.crm.contacts.basicApi
    .getById(contactId, ['phone'])
    .then(results => {
      let dateString = results.body.properties[DATE_PROP];

      hubspotClient.crm.contacts.basicApi
        .update(
          contactId,
          {
            properties: {
              [DATE_PROP]: formatDate(dateString)
            }
          }
        )
        .then(updateResults => null);
    });
}

function formatDate(dateString) {
  let date = new Date(dateString);
  
  let year = '' + date.getFullYear();
  let month = '' + date.getMonth() + 1;
  let day = '' + date.getDate();
  
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  
  // Format as MM/DD/YYYY
  return month + '/' + day + '/' + year;
  
  // Alternatives:
  // - DD/MM/YYYY
  //   return day + '/' + month + '/' + year;
  // - YYYY-MM-DD
  //   return year + '-' + month + '-' + day;
}