// For instructions on how to use this snippet, see this guide:
// https://github.com/HubSpot/sample-workflow-custom-code/blob/main/guides/translate_contact_property.md
// Credit: Amine Ben Cheikh Brahim https://gist.github.com/AmineBENCHEIKHBRAHIM

// Property to translate. For this example, we will translate the "Last NPS Survey Comment"
// property to English.
const PROPERTY_TO_TRANSLATE = 'hs_feedback_last_nps_follow_up';

// Import Axios library for easier HTTP request making
const axios = require('axios')

exports.main = async (event, callback) => {
  // Retrieving the property to translate value from the contact enrolled in the current workflow.
  // This property should be specified in the "Property to include in code" section above the code editor.
  const npsComment = event.inputFields[PROPERTY_TO_TRANSLATE];
  console.log(`Translating text: ${npsComment}`);

  // API Call to DeepL API to translate the property value to British English.
  // We didn't specify a source language because the service is capable of detecting the original language automatically.
  axios
    .post('https://api-free.deepl.com/v2/translate', null, {
      params: {
        'auth_key': '' + process.env.DEEPL_KEY,
        'text': '' + npsComment,
        'target_lang': 'EN-GB'
      }
    })
    .then(response => {
      // Retrieve the translated text from the response
      let translatedToEnglishText = response.data.translations[0].text;
      console.log(translatedToEnglishText);

      // Store the text in an output String called "englishText". It can then be
      // copied in a property using "copy property value" workflow action.
      callback({
        outputFields: {
          englishText: translatedToEnglishText
        }
      })
    });
}
