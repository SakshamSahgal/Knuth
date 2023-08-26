//------------------------------------------------------------Node Packages-----------------------------------------------------
//Path
const path = require('path');
//EXPRESS
const express = require("express"); //including express package for creating a server
const app = express();
const port = process.env.DEV_PORT || 3000
app.use(express.json({limit : '1mb'})); //telling that my webapp will be sending/recieving data in json format (limiting to 1MB)
app.use(express.static(path.join(__dirname,"..","ClientSide","Static"))); //telling that my webapp will be using the files in the ClientSide folder (for the frontend
require('dotenv').config() //including the .env file (for the API keys and DB Credentials)
const {writeDB,readDB,updateDB,deleteDB} = require("./MongoOperations.js"); //including the MongoOperations.js file (for the DB operations)

//------------------------------------------------------------------------------------------------------------------------------

app.listen(port, () => {  
    console.log("Server Started at port " + process.env.DEV_PORT);    
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"..","ClientSide","Knuth.html"));
});

app.get("/Coordinators",(req,res) => {
  res.sendFile(path.join(__dirname,"..","ClientSide","Coordinators.html"));
})

app.get("/coordinatorsList",(req,res) => {
  readDB("Main", "Coordinators", {}).then((coordinators) => {
      res.json(coordinators);
    }).catch((err) => {
      res.status(400).send("Cant' Read DB");
    })
})

// app.post("/create", (req, res) => {
//     console.log(req.body);
//     writeDB("Main", "Coordinators",req.body).then((acknowledged) => {
//         res.json(acknowledged)
//     }).catch((err) => {
//         console.log("Cant' Write to DB");
//         res.status(400).send("Cant' Write to DB");
//     })
// })

// app.get("/read", (req, res) => {
//     readDB("Main", "Coordinators", {}).then((coordinators) => {
//         res.json(coordinators);
//       }).catch((err) => {
//         console.log("Cant' Read DB");
//         res.status(400).send("Cant' Read DB");
//       })
// })

// app.put("/update", (req, res) => {
//     updateDB("Main", "Coordinators", {"name": "Ananya"}, {"name": "Ananya", "Age" : 31}).then((acknowledged) => {
//         res.json(acknowledged);
//     }).catch((err) => {
//         console.log("Cant' Update DB");
//         res.status(400).send("Cant' Update DB");
//     })
// })

// app.delete("/delete", (req, res) => {
//     deleteDB("Main", "Coordinators", {"name": "Ananya"}).then((acknowledged) => {
//         res.json(acknowledged);
//     }).catch((err) => {
//         console.log("Cant' Delete from DB");
//         res.status(400).send("Cant' Delete from DB");
//     })
// })

