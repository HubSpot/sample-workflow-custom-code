const axios = require('axios');
const params = {
  headers: {
    Authorization: `Bearer ${process.env.CCA_token}`,
    'Content-Type': 'application/json',
  },
};

exports.main = async (event, callback) => {
  // Take the enrolled deal ID
  const deal_id = event.inputFields['hs_object_id'];

  // Format data for 1st API call - Calls
  const callData = {
    filters: [
      {
        propertyName: 'associations.deal',
        operator: 'EQ',
        value: deal_id, // Find the calls associated with the enrolled deal
      },
    ],
    sorts: [
      {
        propertyName: 'hs_createdate',
        direction: 'DESCENDING', // List them in descending order
      },
    ],
    properties: ['hs_call_direction', 'hs_call_body', 'hs_timestamp'], // Return the direction and body of the call
  };

  // Format data for 2st API call - Emails
  const emailData = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'associations.deal',
            operator: 'EQ',
            value: deal_id, // Find the emails associated with the enrolled deal
          },
          {
            propertyName: 'hs_email_direction',
            operator: 'NEQ',
            value: 'Forwarded', // Excluded forwarded emails
          },
        ],
      },
    ],
    sorts: [
      {
        propertyName: 'hs_createdate',
        direction: 'DESCENDING', // List them in descending order
      },
    ],
    properties: ['hs_email_direction', 'hs_timestamp'], // Return the direction of the email
  };

  // Make 1st API call to search Calls
  axios
    .post(
      'https://api.hubapi.com/crm/v3/objects/calls/search',
      callData,
      params
    )
    .then(response => {
      // Retrieve details of the most recent Call
      let recentCall = response.data.results[0].properties;
      let callTime = dateConvert(recentCall.hs_timestamp);
      let callDir = recentCall.hs_call_direction;
      console.log(callDir + ' at ' + callTime);

      // Make 2nd API call to search Emails
      axios
        .post(
          'https://api.hubapi.com/crm/v3/objects/emails/search',
          emailData,
          params
        )
        .then(res => {
          // Retrieve details of the most recent Email
          let recentEmail = res.data.results[0].properties;
          let emailTime = dateConvert(recentEmail.hs_timestamp);
          let emailDir = recentEmail.hs_email_direction;
          console.log(emailDir + ' at ' + emailTime);

          // Format combined message
          let message = `Last ${callDir} call at ${callTime}, Last ${emailDir} at ${emailTime}`;

          // Store the outputs for use in other parts of the workflow
          callback({
            outputFields: {
              last_call_direction: callDir,
              last_call_time: callTime,
              last_email_direction: emailDir,
              last_email_time: emailTime,
              message: message,
            },
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(error => {
      console.log(error);
    });
};

// Function to neaten the format of the date outputs
function dateConvert(date) {
  var dateTime = new Date(date);
  return dateTime.toLocaleString('en-SG', {
    timeZone: 'Asia/Singapore',
    hour12: false,
  });
}
