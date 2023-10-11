module.exports = (app) => {

    const path = require('path');
    const { isLoggedIn } = require("../Middlewares.js");
    const { readDB } = require("../MongoOperations");
    const { updateLastActivity } = require("../Middlewares.js");

    app.get("/pod",isLoggedIn,updateLastActivity,async (req, res) => {

        var coordinators = await readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }); //querrying DB to check if the email of the logged in user is present in the coordinators list

        let template = {
            page: "POD",
            emailTo: req.user.emails[0].value,
            coordinator : (coordinators.length > 0) 
        }
        res.render(path.join(__dirname,"..","..","ClientSide","pod.ejs"),template);
    })
}