// The following snippet applies to the Deal object, but can be modified to calculate a property on any Object
// This snippet requires 3 custom properties created in HubSpot:
// "Start Date" (date) / "End Date" (date) / "Duration" (number)

const hubspot = require('@hubspot/api-client');
  exports.main = (event, callback) => {

   // Set up the HubSpot API client
    const hubspotClient = new hubspot.Client({
      accessToken: process.env.secretName
    });

   // Use the client to pull information relating to the currently enrolled deal
    hubspotClient.crm.deals.basicApi.getById(event.object.objectId, ["start_date","duration",])
      .then(results => {

   // Store properties in variables
      let startDate = results.body.properties.start_date;
      let duration = results.body.properties.duration;

   // Calculate the end date from the variables input
      let d = new Date(startDate)
      let i = parseInt(duration)
      let r= new Date(d.setDate(d.getDate()+i))
      r= r.getTime()


        callback({
   // Store the calculated date in a workflow output - don't forget to copy that value to your "End date" property
          outputFields: {
            end_date: r
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

// Original author: Theo Burlion (https://gist.github.com/Takazz)
