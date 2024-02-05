const express = require("express"); //including express package for creating a server
const session = require('express-session'); // Import express-session use to manage sessions
const path = require('path');
const useragent = require('express-useragent');

require('dotenv').config() //including the .env file (for the API keys and DB Credentials)

const app = express();

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));      //telling express to use sesssion middleware [Secret used to sign the session cookie]
app.use(express.json({ limit: '1mb' }));                                                               //telling that my webapp will be sending/recieving data in json format (limiting to 1MB)
app.use(express.static(path.join(__dirname, "..", "ClientSide", "Static")));                           //telling that my webapp will be using the files in the ClientSide/Static folder for static files

app.use(useragent.express());                                                                          // use the useragent middleware to parse useragent header
app.set('trust proxy', true);                                                                          // Enable "trust proxy" to get the client's IP address through proxy headers [setting this makes the load balancer to forward the client's IP address in the X-Forwarded-For header instead of loopback address]
app.set('view engine', 'ejs');                                                                         // Setting the view engine to EJS

module.exports = { app };