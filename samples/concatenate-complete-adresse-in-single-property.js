exports.main = (event, callback) => {
  const address = event.inputFields['address'];
  const city = event.inputFields['city'];
  const state = event.inputFields['state'];
  const country = event.inputFields['country'];
  const zip = event.inputFields['zip'];

  const completeAddress = `${address}, ${city}, ${state}, ${country}, ${zip}`;
  callback({
    outputFields: {
      completeAddress: completeAddress,
    },
  });
};
