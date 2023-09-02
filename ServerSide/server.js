//------------------------------------------------------------Node Packages-----------------------------------------------------
const express = require("express"); //including express package for creating a server
const session = require('express-session'); // Import express-session use to manage sessions
const path = require('path');
require('dotenv').config() //including the .env file (for the API keys and DB Credentials)

const app = express();

const port = process.env.DEV_PORT || 3000

app.use(session({ secret: process.env.SESSION_SECRET , resave: false, saveUninitialized: true })); //telling express to use sesssion middleware [Secret used to sign the session cookie]
app.use(express.json({limit : '1mb'})); //telling that my webapp will be sending/recieving data in json format (limiting to 1MB)
app.use(express.static(path.join(__dirname,"..","ClientSide","Static"))); //telling that my webapp will be using the files in the ClientSide folder (for the frontend

const {isLoggedIn,redirectIfLoggedIn} = require("./Middlewares.js"); //including the Middlewares.js file (for the middlewares)
//------------------------------------------------------------------------------------------------------------------------------

// Setting the view engine to EJS
app.set('view engine', 'ejs');

require("./GoogleOAuthRoutes.js")(app); //requiring the GoogleOAuthRoutes.js file (for the google auth routes)
require("./CoordinatorRoutes.js")(app); //requiring the CoordinatorRoutes.js file (for the coordinator page routes)
require("./ProfileRoutes.js")(app); //requiring the ProfileRoutes.js file (for the profile page routes)
require("./AnnouncementRoutes.js")(app); //requiring the AnnouncementRoutes.js file (for the announcement page routes)

app.listen(port, () => {  
    console.log("Server Started at port " + process.env.DEV_PORT);    
});

app.get("/",redirectIfLoggedIn, (req, res) => { //unprotected route
  res.sendFile(path.join(__dirname,"..","ClientSide","Knuth.html"));
});

app.get("/home",isLoggedIn,(req, res) => { //protected route
  res.render(path.join(__dirname,"..","ClientSide","home"),{email: req.user.emails[0].value})
});

app.get("/ConnectWithUs",isLoggedIn,(req,res) => {
  res.render(path.join(__dirname,"..","ClientSide","ConnectWithUs"),{email: req.user.emails[0].value});
})

app.get('/logout',isLoggedIn, (req, res, next) => {
  res.clearCookie('connect.sid');
  req.logout(function (err) {
    req.session.destroy(function (err) { // destroys the session
      res.redirect("/");
    });
  });
});