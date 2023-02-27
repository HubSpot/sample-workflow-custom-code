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

// Return row id if the row with objectId exists or 0 if not exists
const getExistingRowId = async objectId => {
  const url = `/cms/v3/hubdb/tables/${dbTableId}/rows?object_id=${objectId}`;
  const response = await hubspotClient.apiRequest({
    method: 'get',
    path: url,
  });
  const json = await response.json();
  return json.total === 0 ? 0 : json.results[0].id;
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
  // NOTE: Input field names must match these keys. Ex: hs_object_id
  const {
    hs_object_id: objectId,
    topic,
    // set default values for other properties due to only primary display
    // property exists after creating a new record
    details = '',
    date = Date.now(),
    speakers = '',
    address = '',
  } = event.inputFields;

  try {
    const rowId = await getExistingRowId(objectId);
    if (rowId !== 0) {
      const response = await updateRow(rowId, [
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
