This custom coded action aims at managing renewals inside of HubSpot. 

Prerequisites:
2 custom properties specifying the deal applied discount and the deal length in days should be created. 

Trigger: 
A new deal gets closed won in a specific pipeline

Actions: 
The Code will follow these steps:
- Takes the original deal amount, deal_length, deal_discount, deal name and close date as input
- Calculates new discount value to be applied to the renewal deal and its new amount 
- Calculates new close date of the renewal deal which is the addition of the deal length in days to the original deal close date
- Gets the ID of the primary company associated to the deal
- Creates the renewal deal with the new calculated properties
- Associates the same company associated to the original deal to the renewal deal
