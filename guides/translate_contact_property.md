This custom coded action aims at automatically translating certain contact properties to a certain language.

It takes the properties to translate as input and gives the translated properties' value as output.

It uses an API provided from a Tranlation Service called DeepL. Other Translation services APIs can be used. takes a new lead postal code as input. Then provides the ID of the Owner that should be assigned to that lead (an Account Executive for a sales lead for example).

The Code will follow these steps:

- Taking the properties to translate as input
- Make an API call to DeepL API to translate the properties while specifying the target language
- Store those values in output fields that can be copied to custom properties in the next step using "Copy Property Value" action

A example of a use case for this code maybe:
- An organisation is getting leads from multiple sources and wants to make sure all the data in the portal is in a single language
- An organisation using a central hubspot portal to gather data from its differents BUs and wanting to translate all the data to English for example in the central portal
