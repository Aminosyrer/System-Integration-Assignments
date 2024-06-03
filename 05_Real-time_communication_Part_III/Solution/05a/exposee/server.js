const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const storageFile = path.join(__dirname, 'storage.json');

app.use(bodyParser.json());

if (!fs.existsSync(storageFile)) {
    fs.writeFileSync(storageFile, JSON.stringify({ webhooks: [] }, null, 2));
}

const loadWebhooks = () => {
    const data = fs.readFileSync(storageFile);
    return JSON.parse(data).webhooks;
};

const saveWebhooks = (webhooks) => {
    fs.writeFileSync(storageFile, JSON.stringify({ webhooks }, null, 2));
    console.log('Webhooks saved:', webhooks);
};

app.post('/register', (req, res) => {
    const { url, event } = req.body;
    const webhooks = loadWebhooks();
    webhooks.push({ url, event });
    saveWebhooks(webhooks);
    res.status(201).send('Webhook registered');
    console.log('Webhook registered:', { url, event });
});

app.post('/unregister', (req, res) => {
    const { url, event } = req.body;
    let webhooks = loadWebhooks();
    webhooks = webhooks.filter(wh => wh.url !== url || wh.event !== event);
    saveWebhooks(webhooks);
    res.status(200).send('Webhook unregistered');
    console.log('Webhook unregistered:', { url, event });
});

app.post('/ping', (req, res) => {
    const webhooks = loadWebhooks();
    webhooks.forEach(wh => {
        console.log(`Pinging ${wh.url} for event ${wh.event}`);
    });
    res.status(200).send('Ping event sent to all registered webhooks');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});