
module.exports = (app) => {
    
    const { readDB } = require("./MongoOperations");
    const { isLoggedIn } = require("./Middlewares.js");
    const path = require("path");

    //route that renders the coordinators page
    app.get("/coordinators", isLoggedIn, (req, res) => {
        res.render(path.join(__dirname, "..", "ClientSide", "Coordinators"), { email: req.user.emails[0].value });
    })
    
    //route that returns the list of coordinators fetched from the DB
    app.get("/coordinatorsList", isLoggedIn, (req, res) => {
        readDB("Main", "Coordinators", {}).then((coordinators) => {
            res.json(coordinators);
        }).catch((err) => {
            res.status(400).send("Cant' Read DB");
        })
    })

};