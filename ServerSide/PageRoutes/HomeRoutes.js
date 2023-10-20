
module.exports = (app) => {

  const { isLoggedIn,updateLastActivity } = require("../Middlewares.js");
  const {readDB} = require("../MongoOperations.js")
  const path = require("path");
  require("dotenv").config();

  app.get("/home", isLoggedIn,updateLastActivity,async (req, res) => { //protected route

      console.log(req.user.emails[0].value + " is viewing the home page")

      let Template = {
        page: "home",
        emailTo: req.user.emails[0].value,
        websitesForPractice : await readDB("Resources","websitesForPractice",{}),
        CPTools : await readDB("Resources","CPTools",{}),
      }

      res.render(path.join(__dirname, "..","..","ClientSide", "home.ejs"), Template)
  });

};