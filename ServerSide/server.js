//------------------------------------------------------------Node Packages-----------------------------------------------------
//EXPRESS
const express = require("express"); //including express package for creating a server
const app = express();
const port = process.env.DEV_PORT || 3000
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)
require('dotenv').config() //including the .env file (for the API keys and DB Credentials)
const {readDB, writeDB} = require("./MongoOperations.js") //including the MongoOperations.js file (for the DB operations)

//------------------------------------------------------------------------------------------------------------------------------

app.listen(port, () => {  
    console.log("Server Started")
});

readDB("Main", "Coordinators", {}).then((coordinators) => {
    console.log("Fetched entries:", coordinators);
  })

writeDB("Main", "Coordinators", {"name": "Ananya", "Age" : 20}).then((acknowledged) => {
    console.log(acknowledged);
})