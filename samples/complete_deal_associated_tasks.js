/**
 * Originally created by HubSpot community member dirkd in this post:
 * https://community.hubspot.com/t5/HubSpot-Ideas/Allow-workflows-to-delete-or-mark-tasks-complete/idc-p/502512#M93728
 */

const hubspot = require('@hubspot/api-client');
const request = require("request");

exports.main = (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.secretName
  });

  // Find all tasks associated with deal
  hubspotClient.crm.deals.associationsApi.getAll(event.object.objectId, ["task"])
    .then(results => {
      // Go through each result returned and set status to COMPLETED
      results.body.results.forEach(task => {
        var options = {
          method: 'PATCH',
          url: 'https://api.hubapi.com/engagements/v1/engagements/' + task.id,
          qs: {
            haccessToken: process.env.secretName
          },
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            engagement: {},
            metadata: {
              status: 'COMPLETED'
            }
          },
          json: true
        };

        request(options, function (error, response, body) {
          if (error) {
            throw new Error(error);
          }
        });
      });
    });
}
