require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const path = require('path');

const app = express();

// Auth0 configuration
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SESSION_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    clientSecret: process.env.AUTH0_CLIENT_SECRET
};

// Middleware
app.use(auth(config));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
    res.render('home', { user: req.oidc.user });
});

// Profile route
app.get('/profile', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.render('profile', { user: req.oidc.user });
    } else {
        res.redirect('/login');
    }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});