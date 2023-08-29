//------------------------------------------------------------Node Packages-----------------------------------------------------
const express = require("express"); //including express package for creating a server
const session = require('express-session'); // Import express-session use to manage sessions
const path = require('path');
require('dotenv').config() //including the .env file (for the API keys and DB Credentials)

const app = express();
const passport = require('./Auth'); // Import passport configuration from auth.js

app.use(session({ secret: process.env.SESSION_SECRET , resave: false, saveUninitialized: true })); //telling express to use sesssion middleware [Secret used to sign the session cookie]
app.use(passport.initialize()); //Telling express to use passport for authentication
app.use(passport.session()); // Tell express to use passport.session() to support persistent login sessions (recommended).
app.use(express.json({limit : '1mb'})); //telling that my webapp will be sending/recieving data in json format (limiting to 1MB)
app.use(express.static(path.join(__dirname,"..","ClientSide","Static"))); //telling that my webapp will be using the files in the ClientSide folder (for the frontend

const {writeDB,readDB,updateDB,deleteDB} = require("./MongoOperations.js"); //including the MongoOperations.js file (for the DB operations)
const {isLoggedIn,isCoordinator} = require("./Middlewares.js"); //including the Middlewares.js file (for the middlewares)
//------------------------------------------------------------------------------------------------------------------------------


// Setting the view engine to EJS
app.set('view engine', 'ejs');

const port = process.env.DEV_PORT || 3000
app.listen(port, () => {  
    console.log("Server Started at port " + process.env.DEV_PORT);    
});

app.get("/", (req, res) => { //unprotected route
  res.sendFile(path.join(__dirname,"..","ClientSide","Knuth.html"));
});

app.get("/home",isLoggedIn,(req, res) => { //protected route
  res.sendFile(path.join(__dirname,"..","ClientSide","home.html"));
});

app.get("/coordinators",isLoggedIn,(req,res) => {
  res.sendFile(path.join(__dirname,"..","ClientSide","Coordinators.html"));
})

app.get("/coordinatorsList",isLoggedIn,(req,res) => {
  readDB("Main", "Coordinators", {}).then((coordinators) => {
      res.json(coordinators);
    }).catch((err) => {
      res.status(400).send("Cant' Read DB");
    })
})

app.get("/announcements",isLoggedIn,(req,res) => {
  console.log(req.user)
  res.render(path.join(__dirname,"..","ClientSide","Announcements"),{email : req.user.emails[0].value,username: req.user.displayName, profilePicture : req.user.photos[0].value});//sending the user data to the frontend
})

app.get("/ConnectWithUs",isLoggedIn,(req,res) => {
  res.sendFile(path.join(__dirname,"..","ClientSide","ConnectWithUs.html"));
})


app.post("/announce",isCoordinator,(req,res) => {
  res.send("successfully posted");
})

app.get('/logout',isLoggedIn, (req, res, next) => {
  res.clearCookie('connect.sid');
  req.logout(function (err) {
    req.session.destroy(function (err) { // destroys the session
      res.redirect("/");
    });
  });
});

//to trigger google auth
app.get("/auth/google", passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'select_account' })); //route for google auth trigger

//to handle the callback from google
app.get("/auth/google/callback", passport.authenticate('google', {
  successRedirect: "/home", //redirect to protected route if login successful
  failureRedirect: "/auth/google/failure" //redirect to failure route if login fails
}));

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
})

