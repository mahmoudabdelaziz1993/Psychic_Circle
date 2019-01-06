var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login');
});
router.get('/signup', function(req, res) {
    res.render('register');
});
router.get('/profile', authorized, function(req, res, next) {
    res.render('roompick', {
        user: req.user
    });
});

router.get('/chatroom', authorized, function(req, res, next) {
    res.render('chatroom', {
        user: req.user
    });
});


module.exports = router;

function authorized(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};