/**
 * Searches for another contact with the same value of DEDUPE_PROPERTY.
 * - If no matches are found, nothing happens
 * - If one match is found, the enrolled contact is merged into the matching contact
 * - If more than one match is found, the action fails
 */

const DEDUPE_PROPERTY = 'phone';

const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  // Make sure to add your API key under "Secrets" above.
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.secretName
  });

  hubspotClient.crm.contacts.basicApi
    .getById(event.object.objectId, [DEDUPE_PROPERTY])
    .then(contactResult => {
      let dedupePropValue = contactResult.body.properties[DEDUPE_PROPERTY];

      console.log(`Looking for duplicates based on ${DEDUPE_PROPERTY} = ${dedupePropValue}`);
      hubspotClient.crm.contacts.searchApi
        .doSearch({
          filterGroups: [{
            filters: [{
              propertyName: DEDUPE_PROPERTY,
              operator: 'EQ',
              value: dedupePropValue
            }]
          }]
        })
        .then(searchResults => {
          let idsToMerge = searchResults.body.results
            .map(object => object.id)
            .filter(vid => Number(vid) !== Number(event.object.objectId));

          if (idsToMerge.length == 0) {
            console.log('No matching contact, nothing to merge');
            return;
          } else if (idsToMerge.length > 1) {
            console.log(`Found multiple potential contact IDs ${idsToMerge.join(', ')} to merge`);
            throw new Error("Ambiguous merge; more than one matching contact");
          }

          let idToMerge = idsToMerge[0];
          console.log(`Merging enrolled contact id=${event.object.objectId} into contact id=${idToMerge}`);
          hubspotClient
            .apiRequest({
              method: 'POST',
              path: `/contacts/v1/contact/merge-vids/${idToMerge}`,
              body: {
                vidToMerge: event.object.objectId
              }
            })
            .then(mergeResult => {
              console.log('Contacts merged!');
            });
        });
    });
};
