

module.exports = (app) => {

    const { readDB } = require("./MongoOperations");
    const { isLoggedIn, isCoordinator } = require("./Middlewares.js");
    const path = require("path");

    app.get("/announcements", isLoggedIn, (req, res) => {
        readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }).then((coordinators) => { //querrying DB to check if the email of the logged in user is present in the coordinators list
            res.render(path.join(__dirname, "..", "ClientSide", "Announcements"), {page : "announcements", emailTo: req.user.emails[0].value, username: req.user.displayName, profilePicture: req.user.photos[0].value,coordinator : (coordinators.length > 0) });//sending the user data to the frontend
        }).catch((err) => {
            res.render(path.join(__dirname, "..", "ClientSide", "Announcements"), {page : "announcements", emailTo: req.user.emails[0].value, username: req.user.displayName, profilePicture: req.user.photos[0].value,coordinator : false });//sending the user data to the frontend
        })
    })

    app.post("/announce", isCoordinator, (req, res) => {
        res.send("successfully posted");
    })
};