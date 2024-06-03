const axios = require('axios');

const registerWebhook = async () => {
    try {
        const response = await axios.post('http://localhost:3000/register', {
            url: 'http://example.com/webhook',
            event: 'payment_received'
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error registering webhook:', error);
    }
};

registerWebhook();