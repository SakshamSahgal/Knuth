
module.exports = (app) => {

    const { readDB } = require("../MongoOperations");
    const { isLoggedIn, updateLastActivity } = require("../Middlewares.js");
    const path = require("path");

    //route that renders the coordinators page
    app.get("/coordinators", isLoggedIn,updateLastActivity, (req, res) => {
        
        console.log(req.user.emails[0].value + " is viewing the coordinators page")

        readDB("Main", "Coordinators", {}).then((coordinators) => {
            res.render(path.join(__dirname, "..", "..", "ClientSide", "coordinators"), { page: "coordinators", emailTo: req.user.emails[0].value, coordinators: coordinators });
        }).catch((err) => {
            res.render(path.join(__dirname, "..", "..", "ClientSide", "coordinators"), { page: "coordinators", emailTo: req.user.emails[0].value, coordinators: [] });
        })
    })

};