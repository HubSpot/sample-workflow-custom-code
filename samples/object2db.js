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
  await hubspotClient.cms.hubdb.rowsApi.createTableRow(dbTableId, { values });
  await hubspotClient.cms.hubdb.tablesApi.publishDraftTable(dbTableId);
};

const updateRow = async (rowId, values) => {
  await hubspotClient.cms.hubdb.rowsApi.updateDraftTableRow(dbTableId, rowId, {
    values,
  });
  await hubspotClient.cms.hubdb.tablesApi.publishDraftTable(dbTableId);
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
    // NOTE: HubDB column names must match these keys. Ex: object_id
    const values = {
      object_id: objectId,
      topic,
      details,
      date: parseInt(date, 10),
      speakers,
      address,
    };
    if (rowId !== 0) {
      await updateRow(rowId, values);
    } else {
      await createRow(values);
    }
  } catch (err) {
    console.error(
      err.message === 'HTTP request failed'
        ? JSON.stringify(err.response, null, 2)
        : err
    );
    throw err;
  }
};
