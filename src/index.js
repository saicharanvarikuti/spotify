const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy
const trackAdviceRoutes = require('./routes/trackAdviceRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// mongoDB configuration
mongoose.connect(process.env.MONGODB_URI)
    .then(()=> console.log('connected to database'))
    .catch((err)=> console.error('Error connecting to Database' ,err))

// session configuration
app.use(session({
    secret: process.env.SPOTIFY_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Spotify OAuth2 strategy
passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_REDIRECT_URI
  },
  (accessToken, refreshToken, expires_in, profile, done) => {
    // Save tokens and profile
    const user = { profile, accessToken, refreshToken, expires_in };
    return done(null, user);
  }
));

// middlewares, routes
app.use(express.json())
app.use('/api',trackAdviceRoutes)

app.get('/auth/spotify', passport.authenticate('spotify', {
    scope: ['user-read-private'],
    showDialog: true
  }));

app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) console.error(err);
      res.redirect('/');
    });
  });

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome, ${req.user.profile.displayName}!`);
  } else {
    res.redirect('/auth/spotify');
  }
});

app.use((err, req, res, next)=>{
    console.error(err.stack)
    res.status(500).json({error: 'Something went wrong in server'})
})

app.listen(PORT, ()=>console.log('server running on port: ', PORT))
