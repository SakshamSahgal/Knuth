module.exports = (app) => {

  const { readDB } = require("./MongoOperations");
  const { isLoggedIn } = require("./Middlewares.js");
  const path = require("path");

  app.get("/home", isLoggedIn, (req, res) => { //protected route
    readDB("Main", "Events", {}).then((events) => {
      res.render(path.join(__dirname, "..", "ClientSide", "home"), { page: "home", emailTo: req.user.emails[0].value, events : events  })
    }).catch((err) => {
      res.render(path.join(__dirname, "..", "ClientSide", "home"), { page: "home", emailTo: req.user.emails[0].value, events : [] })
    })
    
  });
};