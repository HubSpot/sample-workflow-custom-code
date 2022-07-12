# Importing date library

from datetime import datetime


def main(event):
    # Function to compare both dates

    def days_between(d1, d2):
        d1 = datetime.fromtimestamp(d1)
        d2 = datetime.fromtimestamp(d2)
        return abs((d2 - d1).days)

    # Import and format date fields from HubSpot record

    creationDate = int(event.get('inputFields').get('createdate'))
    creationDate_s = creationDate / 1000
    mqlDate = int(event.get('inputFields').get('hs_lifecyclestage_marketingqualifiedlead_date'))
    mqlDate_s = mqlDate / 1000
    leadScoringDuration = days_between(creationDate_s, mqlDate_s)

    # Output calculation of differences in days.

    return {
        "outputFields": {
            "leadScoringDuration": leadScoringDuration,
        }
    }

# Original author: Dom Whittington (https://github.com/DomWhittington)
# Reviewed by: Jan Bogaert
