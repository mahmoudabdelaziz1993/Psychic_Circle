var express = require('express');
var router = express.Router();

var express = require('express');
var router = express.Router();
const passport = require('passport');
const keys = require('../keys/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// -----------------------------------------  google+----------------------------------------

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));
router.get('/google/vv', passport.authenticate('google'), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
});
//------------------------------------------- facebook ----------------------------------------
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/profile');
    });
//--------------------------------------------  local-signup -----------------------------------
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/signup',
    successRedirect: '/profile'
        //failureFlash:true 
}));
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/login',
    successRedirect: '/profile'
}));
//-------------------------------------------- logout ------------------------------------------- 
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;


module.exports = router;