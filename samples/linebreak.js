const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.secretName
  });

  // replace 'multiline' with your multi line text property name
  hubspotClient.crm.contacts.basicApi.getById(event.object.objectId, ['multiline'])
    .then(results => {
      let multiline = results.body.properties.multiline;
    console.log(multiline);
	  multiline = multiline.replace(/(?:\r\n|\r|\n)/g, '<br>');
    console.log(multiline);
    
      callback({
        outputFields: {
          multiline
        }
      });
    })
}

// Orignal author: Tyler Gunji (https://gist.github.com/dshukertjr)
