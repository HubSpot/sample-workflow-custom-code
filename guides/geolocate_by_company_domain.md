This action is based on a company trigger.
- Each time a company is added and the domain name is known.
- We take the domain and converts it to an ip adress with the built in dns Node.js module.
- Then we geolocate the ip address to get a postal address, with the ip-api.com service.
- After that we set those values in the company record :
```JavaScript
{
  "server_location": serverLocation,
   "server_provider": serverProvider
}
```
