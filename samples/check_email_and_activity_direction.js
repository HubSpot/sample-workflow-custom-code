/**
 * Original author: Rebecca Wong <rwong@hubspot.com>
 */
const hubspot = require('@hubspot/api-client');

// Format a unix timestamp to the specified language-sensitive representation.
function formatTimestamp(timestamp) {
  // Change the locale and options to fit your needs.
  const locale = 'en-SG';
  const options = {
    timeZone: 'Asia/Singapore',
    hour12: false,
  };
  return new Date(timestamp).toLocaleDateString(locale, options);
}

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.SECRET_TOKEN,
  });

  // Find the most recent Call associated to the enrolled Deal.
  const enrolledDealId = event.object.objectId;
  const callsSearchRequest = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'associations.deal',
            operator: 'EQ',
            value: enrolledDealId,
          },
        ],
      },
    ],
    sorts: [
      {
        propertyName: 'hs_createdate',
        direction: 'DESCENDING',
      },
    ],
    properties: ['hs_call_direction', 'hs_timestamp'],
    limit: 1, // We only need the most recent call.
    after: 0,
  };

  const callsResponse = await hubspotClient.apiRequest({
    method: 'POST',
    path: '/crm/v3/objects/calls/search',
    body: callsSearchRequest,
  });
  const callsJson = await callsResponse.json();

  const [mostRecentCall] = callsJson.results;
  let callDirection;
  let callTime;
  let callMessage;
  if (mostRecentCall) {
    const { hs_call_direction, hs_timestamp } = mostRecentCall.properties;
    callDirection = hs_call_direction;
    callTime = formatTimestamp(hs_timestamp);
    callMessage = `Last ${callDirection} call at ${callTime}.`;
  } else {
    callMessage = 'No recent associated calls found.';
  }
  console.log(callMessage);

  // Find the most recent, non-forwarded Email associated to the enrolled Deal.
  const emailsSearchRequest = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'associations.deal',
            operator: 'EQ',
            value: enrolledDealId,
          },
          {
            propertyName: 'hs_email_direction',
            operator: 'NEQ',
            value: 'Forwarded',
          },
        ],
      },
    ],
    sorts: [
      {
        propertyName: 'hs_createdate',
        direction: 'DESCENDING',
      },
    ],
    properties: ['hs_email_direction', 'hs_timestamp'],
    limit: 1, // We only need the most recent email.
    after: 0,
  };

  const emailsResponse = await hubspotClient.apiRequest({
    method: 'POST',
    path: '/crm/v3/objects/emails/search',
    body: emailsSearchRequest,
  });
  const emailsJson = await emailsResponse.json();

  const [mostRecentEmail] = emailsJson.results;
  let emailDirection;
  let emailTime;
  let emailMessage;
  if (mostRecentEmail) {
    const { hs_email_direction, hs_timestamp } = mostRecentEmail.properties;
    emailDirection = hs_email_direction;
    emailTime = formatTimestamp(hs_timestamp);
    emailMessage = `Last ${emailDirection} email at ${emailTime}.`;
  } else {
    emailMessage = 'No recent associated emails found.';
  }
  console.log(emailMessage);

  callback({
    outputFields: {
      last_call_direction: callDirection,
      last_call_time: callTime,
      last_email_direction: emailDirection,
      last_email_time: emailTime,
      message: [callMessage, emailMessage].filter(Boolean).join(''),
    },
  });
};
