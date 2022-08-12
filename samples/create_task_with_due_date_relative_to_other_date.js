//    Hubspot Workflow Custom Code for Task Creation with Due Date Calculation
//    Copyright (C) 2022, Stefan Woehrer | LEAN-Coders GmbH | https://lean-coders.at
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program. If not, see <http://www.gnu.org/licenses/>.

// This code demonstrates how it is possible to create tasks with Custom Code in
// Hubspot Workflows with Due Dates calculated by other properties in hubspot.
// See the following blog article for more information (German):
// https://lean-coders.at/blog/hubspot-workflows-custom-code-zum-erstellen-von-tasks-mit-dynamischem-faelligkeitsdatum

const hubspot = require('@hubspot/api-client');

const createTask = async (hubspotClient, taskBodyObject) => {    
    const url = `/engagements/v1/engagements`;
    hubspotClient.apiRequest({
        path: url,
        method: 'POST',
        body: taskBodyObject,
        json: true
    });
};

// Adds "days" days to the timestamp "ts" and returns the new timestamp
const addDaysToTimeStamp = (ts, days) => {
    let ret = new Date(ts);
    ret.setDate(ret.getDate() + days);
    return ret.getTime();
}

const buildDealTaskObject = (taskOwner, timestamp, dealId, subject) => {
    return {
        engagement: {
            active: true,
            type: 'TASK',
            ownerId: taskOwner,
            timestamp: timestamp
        },
        associations: {
            dealIds: [dealId],
        },
        metadata: {
            body: subject,
            subject: subject,
            status: "NOT_STARTED",
            forObjectType: "DEAL"
        }
    };
}

exports.main = async (event, callback) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env.secretName
    });

    const taskOwner = parseInt(event.inputFields['hubspot_owner_id']);
    const projectStart = parseInt(event.inputFields['start_date']);
    const dealId = event.object.objectId;
    
    const tasksToCreate = [
        buildDealTaskObject(taskOwner, projectStart, dealId, "Task bei Projektstart"),
        buildDealTaskObject(taskOwner, addDaysToTimeStamp(projectStart, -5), dealId, "Task 5 Tage vor Projektstart"),
        buildDealTaskObject(taskOwner, addDaysToTimeStamp(projectStart, 5), dealId, "Task 5 Tage nach Projektstart"),
    ];

    tasksToCreate.forEach(task => createTask(hubspotClient, task));
}
