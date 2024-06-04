const express = require('express');
const passport = require('passport');

const router = express.Router();

// Auth0 authentication routes
router.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), (req, res) => {
    res.redirect('/');
});

router.get('/callback', passport.authenticate('auth0', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/profile');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;