//------------------------------------------------------------Node Packages-----------------------------------------------------
//EXPRESS
const express = require("express"); //including express package for creating a server
const app = express();
const port = process.env.DEV_PORT || 3000
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)
require('dotenv').config() //including the .env file (for the API keys and DB Credentials)
const { MongoClient, ServerApiVersion } = require('mongodb'); //including the mongoDB package
//------------------------------------------------------------------------------------------------------------------------------


app.listen(port, () => {  
    console.log("Server Started")
});


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function fetchDB(Database, Collection, Query) {
    try {
      await client.connect();
      const db = client.db(Database);
      const collection = db.collection(Collection);
      
      const result = await collection.find(Query).toArray();
      
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error for the caller to handle
    } finally {
      await client.close();
    }
  }

  fetchDB("Main", "Coordinators", {}).then((coordinators) => {
    console.log("Fetched entries:", coordinators);
  })

  
  
  
  
  
  
  