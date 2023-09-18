
module.exports = (app) => {

    const passport = require('./Auth'); // Import passport configuration from auth.js

    app.use(passport.initialize()); //Telling express to use passport for authentication
    app.use(passport.session()); // Tell express to use passport.session() to support persistent login sessions (recommended).

    //to trigger google auth
    app.get("/auth/google", passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'select_account' })); //route for google auth trigger

    //To handle the callback from google
    app.get("/auth/google/callback", passport.authenticate('google', {
        successRedirect: "/home", // Redirect to protected route if login successful
        failureRedirect: "/auth/google/failure" //Redirect to failure route if login fails
    }));

    //To handle Failure
    app.get("/auth/google/failure", (req, res) => {
        res.send("Failed to authenticate..");
    })

};