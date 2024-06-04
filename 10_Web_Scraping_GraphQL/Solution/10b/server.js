const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51PNiL6034krgSXIpUt6AgKHqxg8bhuEUWuPnzhEZlYJFB3I1kHAKGN8sNCMsqzpFYtGQIdwXKNhUcwsUjsoGS1tt00xTaWCZvz');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});