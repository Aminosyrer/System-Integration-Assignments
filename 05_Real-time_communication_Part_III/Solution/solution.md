# 05a

# Exposee

There is a webhook for the following:
- `payment_received`

After starting up `server.js`, there will be 3 endpoints you can call. Register webhook, unregister webhook and ping webhooks. Below is each of them described:

1. **Register Webhook**
   - URL: `/register`
   - Method: `POST`
   - Payload: 
     ```json
     {
       "url": "http://example.com/webhook",
       "event": "payment_received"
     }
     ```

2. **Unregister Webhook**
   - URL: `/unregister`
   - Method: `POST`
   - Payload:
     ```json
     {
       "url": "http://example.com/webhook",
       "event": "payment_received"
     }
     ```

3. **Ping Webhooks**
   - URL: `/ping`
   - Method: `POST`
   - Description: Calls all registered webhooks for testing purposes.

# Integrator

Start up `server.js` and then you can do the following:

1. **Register Webhook**
   - Run: `node registerWebhook.js`
   - Registers a webhook at `http://example.com/webhook` for the `payment_received` event.

2. **Unregister Webhook**
   - Run: `node unregisterWebhook.js`
   - Unregisters the webhook at `http://example/webhook` for the `payment_received` event.

3. **Ping Webhooks**
   - Run: `node pingWebhook.js`
   - Pings all registered webhooks.