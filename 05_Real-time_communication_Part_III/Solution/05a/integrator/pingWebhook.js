const axios = require('axios');

const pingWebhook = async () => {
    try {
        const response = await axios.post('http://localhost:3000/ping');
        console.log(response.data);
    } catch (error) {
        console.error('Error pinging webhooks:', error);
    }
};

pingWebhook();