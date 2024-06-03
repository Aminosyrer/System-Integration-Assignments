const axios = require('axios');

const unregisterWebhook = async () => {
    try {
        const response = await axios.post('http://localhost:3000/unregister', {
            url: 'http://example.com/webhook',
            event: 'payment_received'
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error unregistering webhook:', error);
    }
};

unregisterWebhook();