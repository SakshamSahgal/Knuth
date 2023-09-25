const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { captureAccount } = require("./AccountDB.js");

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  console.log("called 1");
  captureAccount(profile); //function that checks if account already visited the site, if not, adds it to the DB
  return done(null, profile);
}));

passport.serializeUser((user, done) => { //To determine what data should be stored in the session. 
  console.log("called 2");
  done(null, user);
});

passport.deserializeUser((user, done) => { //to retrive full user data based on the stored identifier
  done(null, user);
});

module.exports = passport;