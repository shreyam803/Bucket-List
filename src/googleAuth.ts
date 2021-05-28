const express = require("express")
const passport = require("passport")
var { Strategy } = require("passport-google-oauth20")
const User = require("./src/models/user")
const mongoose = require("mongoose")

const app = express();

app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser(function (user, cb) {
//     cb(null, user);
// });

// passport.deserializeUser(function (obj, cb) {
//     cb(null, obj);
// });

passport.use(
    new Strategy({
        clientID: '489754038782-dp3754q96r9kr92vkit4mkkv8ea44t2e.apps.googleusercontent.com',
        clientSecret: 'pkrO3L4lSxZQWYPIlIry8G3z',
        callbackURL: 'http://localhost:5000/auth/google/callback'
        // callbackURL: 'http://localhost:5000'
    },
        function (accessToken, refreshToken, profile, done) {
            // if user already exist in your dataabse login otherwise
            // save data and signup
            User.findOne({ googleId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    done(null, currentUser);
                } else {
                    //if not, create a new user 
                    new User({
                        googleId: profile.id,
                    }).save().then((newUser) => {
                        done(null, newUser);
                    });
                }
            })
        })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/fail' }),
    (req, res, next) => {
        //console.log(req.user, req.isAuthenticated());
        res.send(req.user);
        res.send('user is logged in');
    })

app.get('/auth/fail', (req, res, next) => {
    res.send('user logged in failed');
});

app.get('/logout', (req, res, next) => {
    req.logout();
    res.send(req.user);
});