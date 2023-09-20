const { read } = require("fs");

module.exports = (app) => {

  const { readDB } = require("./MongoOperations");
  const { isLoggedIn } = require("./Middlewares.js");
  const path = require("path");

  app.get("/home", isLoggedIn, (req, res) => { //protected route
    readDB("Main", "Events", {}).then((events) => { //querying DB to fetch all the events
      readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }).then((coordinators) => { //querrying DB to check if the email of the logged in user is present in the coordinators list
        if (coordinators.length > 0)
          res.render(path.join(__dirname, "..", "ClientSide", "home"), { page: "home", emailTo: req.user.emails[0].value, events: events, coordinator: true })
        else
          res.render(path.join(__dirname, "..", "ClientSide", "home"), { page: "home", emailTo: req.user.emails[0].value, events: events, coordinator: false })
      }).catch((err) => {
        res.render(path.join(__dirname, "..", "ClientSide", "home"), { page: "home", emailTo: req.user.emails[0].value, events: [], coordinator: false })
      })
    }).catch((err) => {
      res.render(path.join(__dirname, "..", "ClientSide", "home"), { page: "home", emailTo: req.user.emails[0].value, events: [], coordinator: false })
    })

  });
};