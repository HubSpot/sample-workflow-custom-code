/**
 * Original author: Cereno Deng <cereno.deng@outlook.com>
 * Source: https://github.com/cerenodeng/object2db
 */
const hubspot = require('@hubspot/api-client');

// Must set the yourSecretValue
const hubspotClient = new hubspot.Client({
  accessToken: process.env.yourSecretValue,
});

// Must set the table id of HubDB
const dbTableId = 1234567;

// Return row id if the row with objectId exists or false if not exists
const rowExist = async (portalId, objectId) => {
  const url = `/cms/v3/hubdb/tables/${dbTableId}/rows?portalId=${portalId}&object_id=${objectId}`;
  const response = await hubspotClient.apiRequest({
    method: 'get',
    path: url,
  });
  const json = await response.json();
  return json.total === 0 ? false : json.results[0].id;
};

const createRow = async values => {
  const response = await hubspotClient.cms.hubdb.rowsApi.createTableRow(
    dbTableId,
    { values }
  );
  await hubspotClient.cms.hubdb.tablesApi.publishDraftTable(dbTableId);

  return response;
};

const updateRow = async (rowId, values) => {
  // No updateTableRow() now so access the hubspot request method directly
  const url = `/hubdb/api/v2/tables/${dbTableId}/rows/${rowId}`;
  const response = await hubspotClient.apiRequest({
    method: 'put',
    path: url,
    body: {
      values: {
        2: values[0],
        3: values[1],
        4: values[2],
        5: values[3],
        6: values[4],
        7: values[5],
      },
    },
  });
  const json = await response.json();
  await hubspotClient.cms.hubdb.tablesApi.publishDraftTable(dbTableId);

  return json;
};

exports.main = async event => {
  const objectId = event.inputFields['hs_object_id'];
  const topic = event.inputFields['topic'];

  // set default values for other properties due to only primary display property exists after creating a new record
  const details =
    typeof event.inputFields['details'] === 'undefined'
      ? ''
      : event.inputFields['details'];
  const date =
    typeof event.inputFields['date'] === 'undefined'
      ? Date.now()
      : event.inputFields['date'];
  const speakers =
    typeof event.inputFields['speakers'] === 'undefined'
      ? ''
      : event.inputFields['speakers'];
  const address =
    typeof event.inputFields['address'] === 'undefined'
      ? ''
      : event.inputFields['address'];

  try {
    const result = await rowExist(event.origin.portalId, objectId);
    if (result) {
      const response = await updateRow(result, [
        objectId,
        topic,
        details,
        parseInt(date, 10),
        speakers,
        address,
      ]);
    } else {
      const response = await createRow({
        object_id: objectId,
        topic: topic,
        details: details,
        date: parseInt(date, 10),
        speakers: speakers,
        address: address,
      });
    }
  } catch (err) {
    err.message === 'HTTP request failed'
      ? console.error(JSON.stringify(err.response, null, 2))
      : console.error(err);
    throw err;
  }
};
