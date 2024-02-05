const { updateLog } = require("../Admin/UserActivty.js");

module.exports = (app) => {

    const {readDB} = require("../MongoOperations");
    const {isLoggedIn,updateLastActivity} = require("../Middlewares.js");
    const path = require("path");

    app.get('/logout',isLoggedIn, (req, res, next) => {

      console.log(req.user.emails[0].value + " is logging out")

      res.clearCookie('connect.sid');
      req.logout(function (err) {
        req.session.destroy(function (err) { // destroys the session
          res.redirect("/");
        });
      });
    });
    
    app.get("/profile/:email",isLoggedIn,updateLastActivity,(req,res) => {
      
        updateLog(req, "Accessed the profile page of " + req.params.email)

        readDB("Main", "Users", {"email": req.params.email}).then((found) => { //finding the user in the DB

          if(found.length > 0){ //user found

            const Template = {
              page : "profile",
              myEmail : req.user.emails[0].value, 
              hisEmail : found[0].email, 
              displayName : found[0].displayName, 
              photo : found[0].photo, 
              designation : found[0].designation,
              myProfile : (req.params.email == req.user.emails[0].value)
            }
            
            res.render(path.join(__dirname,"..","..","ClientSide","profile"),Template);
          }
          else{
            res.status(400).send("User Doesn't Exist");
          }
        }).catch((err) => {
          console.log("Cant' Read Users DB while fetching profile page info");
          res.send("Cant' Read Users DB while fetching profile page info")
        })
      })

};

