//------------------------------------------------------------Node Packages-----------------------------------------------------
const express = require("express"); //including express package for creating a server
const session = require('express-session'); // Import express-session use to manage sessions
const path = require('path');
require('dotenv').config() //including the .env file (for the API keys and DB Credentials)

const app = express();

const port = process.env.DEV_PORT || 3000

app.use(session({ secret: process.env.SESSION_SECRET , resave: false, saveUninitialized: true }));  //telling express to use sesssion middleware [Secret used to sign the session cookie]
app.use(express.json({limit : '1mb'}));                                                             //telling that my webapp will be sending/recieving data in json format (limiting to 1MB)
app.use(express.static(path.join(__dirname,"..","ClientSide","Static")));                           //telling that my webapp will be using the files in the ClientSide/Static folder for static files

const {redirectIfLoggedIn} = require("./Middlewares.js"); //including the Middlewares.js file (for the middlewares)
//------------------------------------------------------------------------------------------------------------------------------

// Setting the view engine to EJS
app.set('view engine', 'ejs');

require("./Authorization/GoogleOAuthRoutes.js")(app);              //requiring the GoogleOAuthRoutes.js file (for the google auth routes)
require("./PageRoutes/CoordinatorRoutes.js")(app);                 //requiring the CoordinatorRoutes.js file (for the coordinator page routes)
require("./PageRoutes/ProfileRoutes.js")(app);                     //requiring the ProfileRoutes.js file (for the profile page routes)
require("./PageRoutes/AnnouncementRoutes.js")(app);                //requiring the AnnouncementRoutes.js file (for the announcement page routes)
require("./PageRoutes/HomeRoutes.js")(app);                        //requiring the HomeRoutes.js file (for the home page routes)
require("./PageRoutes/connectWithUsRoutes.js")(app)                //requiring the connectWithUsRoutes.js file (for the connectWithUs page routes)
require("./PageRoutes/AdminRoutes.js")(app);                       //requiring the AdminRoutes.js file (for the admin page routes)
require("./PageRoutes/EventRoutes.js")(app);                       //requiring the EventRoutes.js file (for the event page routes)
require("./PageRoutes/FeedbackRoutes.js")(app);                    //requiring the FeedbackRoutes.js file (for the feedback page routes)
require("./PageRoutes/PODRoutes.js")(app);                         //requiring the POD.js file (for the POD page routes)
require("./KeepAlive.js")(app);                                    //requiring the KeepAlive.js file (for pinging the server at intervals function)


app.listen(port, () => {
    console.log("Server Started at port " + port);
});

app.get("/",redirectIfLoggedIn, (req, res) => {                     //unprotected route
  res.render(path.join(__dirname,"..","ClientSide","Knuth.ejs"));
});
