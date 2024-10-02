const { app } = require("./app");
const path = require('path');

const port = process.env.DEV_PORT || 3000
const { redirectIfLoggedIn } = require("./Middlewares.js");       //including the Middlewares.js file (for the middlewares)
const { connectDB } = require("./MongoOperations.js");

//protected Routes
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
    console.log("host : ",process.env.Host);
    connectDB();
});

//unprotected route
app.get("/",redirectIfLoggedIn, (req, res) => {                     
  res.render(path.join(__dirname,"..","ClientSide","Knuth.ejs"));
});