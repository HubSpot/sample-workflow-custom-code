// For instructions on how to use this snippet, see this guide:
// https://github.com/HubSpot/sample-workflow-custom-code/blob/main/guides/trigger_firebase_web_push_notification.md

// Import Axios library for easier HTTP Requests making
const axios = require('axios')

exports.main = (event, callback) => {

  // Retrieve the Device Token value from the contact enrolled in the current
  // workflow. This property should be specified in the "Property to include
  // in code" section above the code editor.
  const deviceToken = event.inputFields['device_token'];

  // Firebase Server Key should be stored as a Secret to be used in our
  // Custom Coded Action. It can be found in the Firebase console.
  const headers = {
    'Authorization': 'key=' + process.env.FIREBASE_SERVER_KEY,
    'Content-Type': 'application/json'
  };

  // The request body includes the Device token of the contact and the data that
  // will show on the notification itself
  const requestBody = {
    "to": deviceToken,
    "data": {
      "body": "Sending Notification Body From Data",
      "title": "Notification Title from Data"
    }
  }

  axios
    .post(
      'https://fcm.googleapis.com/fcm/send',
      requestBody,
      { headers }
    )
    .then(response => {
      console.log(`Response from Firebase: ${response.body}`);
    });
};
