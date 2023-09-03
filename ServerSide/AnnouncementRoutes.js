

module.exports = (app) => {

    const { isLoggedIn, isCoordinator } = require("./Middlewares.js");
    const path = require("path");

    app.get("/announcements", isLoggedIn, (req, res) => {
        res.render(path.join(__dirname, "..", "ClientSide", "Announcements"), {page : "announcements", emailTo: req.user.emails[0].value, username: req.user.displayName, profilePicture: req.user.photos[0].value });//sending the user data to the frontend
    })

    app.post("/announce", isCoordinator, (req, res) => {
        res.send("successfully posted");
    })
};