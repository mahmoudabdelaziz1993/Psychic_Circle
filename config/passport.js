const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const keys = require('../keys/index');
const {
    mongoose
} = require('./db');
const {
    User
} = require('../models/User');
var LocalStrategy = require('passport-local').Strategy;

//------------------------------------------------ serialize and deserialze cookie -------------------
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
//---------------------------------------------- configure google+ strategy -------------------------
// passport.use(new GoogleStrategy({
//     clientID:keys.google.clientID,
//     clientSecret: keys.google.clientSecret,
//     callbackURL: keys.google.callbackURL
//   },
//   function(accessToken, refreshToken, profile, done) {
//   	console.log(profile);
//   	User.findOne({social_id: profile.id}).then((user)=>{
//   		if(user){
//   			console.log('a;ready a user');
//   			done(null,user);
//   		}else{
//   		var user =new User({
//         username: profile.displayName,
//         social_id: profile.id,
//         image: profile.photos[0].value || null,
//         gender:profile.gender
//         });
//   	    user.save().then((user)=>{
//       	   console.log(user);
//       	   done(null,user);
//         });	
//   		}
//   	});

//     }
// ));
// //--------------------------------------------------configure facebook strategy -----------------------------------
// passport.use(new FacebookStrategy({
//     clientID: keys.facebook.clientID,
//     clientSecret: keys.facebook.clientSecret,
//     callbackURL: keys.facebook.callbackURL
//   },
//   function(accessToken, refreshToken, profile, done) {
//   	console.log(profile);
//   	User.findOne({social_id: profile.id}).then((user)=>{
//   		if(user){
//   			console.log('a;ready a user');
//   			done(null,user);
//   		}else{
//   		var user =new User({
//         username: profile.displayName,
//         social_id: profile.id,
//         //image: profile.photos[0].value || null,
//         gender:profile.gender
//         });
//   	    user.save().then((user)=>{
//       	   console.log(user);
//       	   done(null,user);
//         });	
//   		}
//   	});
//   }
// ));
//---------------------------------------------------- configure local strategy ------------------------
passport.use('local.signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({
            'email': email
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false);
            }
            var newuser = new User();
            newuser.username = req.body.fullname;
            newuser.email = req.body.email;
            newuser.password = newuser.encryptpass(req.body.password);

            newuser.save(function(err) {
                if (err) {
                    return done(err);
                }
                return done(null, newuser);

            });

        });
    }
));


passport.use('local.signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({
            'email': email
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user.validpassword(req.body.password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));