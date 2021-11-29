This Custom coded action can be used to trigger a Web Push notification for a specific contact on a web browser.

This example uses Firebase Cloud Messaging (FCM) which is a service offered by Google to let you relay server messages to registered devices and web apps. The same principle applies for using similar services such as AWS SNS or OneSignal as well as for sending Android/iOS mobile push notifications.

Prerequisites:

- A firebase account has been created
- A Firebase web project has been created and web app credentials were generated (for Web push example)
- Firebase was Initialized (on your website) and Service Worker JS was created (essential for triggering notification when website is not loaded)
- The contact (destinator of the push notification) has provided permission to get notifications and as a result, the device token was generated.

For this example, we assumed the device token was stored on a custom property called "Device Token" on HubSpot contact record. You may consider other alternatives like storing the token on your Website's Database or on HubDB.

For a video overview of the solution, you can check the following link: https://www.loom.com/share/867b508d45614e7fad22c412a1429d14
