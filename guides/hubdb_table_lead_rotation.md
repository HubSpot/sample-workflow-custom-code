This custom coded action takes a new lead postal code as input. Then provides the ID of the Owner that should be assigned to that lead (an Account Executive for a sales lead for example).

The Territory management logic will be stored in a HubDB table inside of HubSpot, that for each postal code has a corresponding Email adress of the Owner to assign.

The Code will follow these steps:

- Taking Postal code as input
- Query The HubDB correspondance table to retrieve the Email address of the Account Executive responsible for that territory (postal code in here, but the logic can be extended to Postal code ranges)
- Find the HubSpot Owner ID (ID of HS User) corresponding to that Email address
- Store that value in an output field that can be copied to the lead Owner ID field in the next step using "Copy Property Value" action

As a result, the correct HubSpot User is assigned as owner of that lead.

This code is a good fit for larger organization having complex territory management logic in place that may result in a very complex and hard to maintain workflow if a workflow is used to manage that.
