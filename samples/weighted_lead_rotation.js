/**
 * Selects a random owner ID with the given relative probability.
 *
 * To get an owner ID for your HubSpot users, go to Setting -> Properties then
 * search for "Contact owner" and click "edit." The "owner ID" is the internal
 * value for each user.
 *
 * To use this value in your workflow, make sure you add an output to your custom
 * code action with a data type of "enumeration" and a name of "owner_id" (no quotes).
 * Then you can use a "Copy property value" action to update the object owner to
 * the user selected by this code.
 *
 * NOTE: since this is random, it is possible that the actual selections will
 * not exactly match the given distribution (in the example, 40%/40%/20%).
 * The more times the code is run, the closer it will be to the actual desired
 * distribution (this is known as the "Law of Large Numbers"; see
 * https://en.wikipedia.org/wiki/Law_of_large_numbers). *This should only be
 * used in situations where it is acceptable if the actual selections are not
 * exactly the chosen percentages!*
 */

// Edit percentages and owner IDs here
const owners = [
  {
    ownerId: 6090927,
    percentage: 40
  },
  {
    ownerId: 6305635,
    percentage: 40
  },
  {
    ownerId: 6305638,
    percentage: 20
  }
];

// Start of code
const Promise = require("bluebird");
const randomNumber = require("random-number-csprng");

exports.main = (event, callback) => {
  let totalPercentage = 0;
  owners.forEach(owner => totalPercentage += owner.percentage);

  Promise
    .try(() => randomNumber(1, totalPercentage))
    .then(randomPercentage => {
      let currentPercentage = 0;
      let selectedOwnerId;
      for (let i = 0; i < owners.length; i++) {
        currentPercentage += owners[i].percentage;

        if (currentPercentage >= randomPercentage) {
          selectedOwnerId = owners[i].ownerId;
          break;
        }
      }

      console.log(`The random value was ${randomPercentage}, which corresponds to owner ID ${selectedOwnerId}`);

      callback({
        outputFields: {
          owner_id: selectedOwnerId
        }
      });
    });
}