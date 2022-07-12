const hubspot = require('@hubspot/api-client')

/**
 * HubSpot will display an error when you paste this code, but it actually 
 * works if you ignore it and just save it. 
 * Workflow action to create a new deal on the same close date every month
 * The date has to be 1st - 28th.
 * If the date is 29th - 31st, the dates will be off at some point. 
 * 
 * Also, watch your API limit. This custom action calls the API 3 times everytime it runs. 
 */
exports.main = async (event, callback) => {

    const hubspotClient = new hubspot.Client({
        apiKey: process.env.HAPIKEY
    });

    const dealId = event.object.objectId

    const results = await hubspotClient.crm.deals.basicApi.getById(dealId, [
        'closedate',
        'amount',
        'dealname',
        'dealstage',
    ])

    const deal = results.body.properties

    const closeDate = new Date(deal.closedate)

    closeDate.setMonth(closeDate.getMonth() + 1)
    closeDate.setMilliseconds(0)
    closeDate.setSeconds(0)
    closeDate.setMinutes(0)
    closeDate.setHours(0)

    const newDealData = {
        properties: {
            closedate: closeDate.getTime(),
            amount: deal.amount,
            dealname: deal.dealname,
            dealstage: deal.dealstage,
        }
    }

    const res = await hubspotClient.crm.deals.basicApi.create(newDealData)

    // Associate the new deal with the company that was originally associated with
    const newDealId = res.body.id
    const associations = await hubspotClient.crm.deals.associationsApi.getAll(dealId, 'companies')
    if(associations.body.results.length > 0) {
        await hubspotClient.crm.deals.associationsApi.create(newDealId, 'companies', associations.body.results[0].id, 'deal_to_company')
    }

    callback({
        outputFields: {}
    })
}

// Original author: Tyler Gunji (https://gist.github.com/dshukertjr)
