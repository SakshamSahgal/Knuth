const {writeDB,readDB,updateDB,deleteDB} = require("./MongoOperations.js"); //including the MongoOperations.js file (for the DB operations)

function isLoggedIn(req, res, next) { //Middleware to check if user is logged in
    if (req.user) //check if user is authenticated
      return next();
    else
      res.redirect("/"); //if not authenticated, redirect to login page
  }
  
function isCoordinator(req,res,next) { //middleware to check if currently logged in user is a coordinator
  if (req.user) //check if user is authenticated
  {
      readDB("Main", "Coordinators", {"list.gmail": req.user.emails[0].value}).then((coordinators) => { //querrying DB to check if the email of the logged in user is present in the coordinators list
              if(coordinators.length > 0)
                  next();
              else
                  res.send("you are not coordinator");
          }).catch((err) => {
              console.log("Cant' Read DB");
              res.status(400).send("Cant' Read DB");
          })
  }
  else
    res.status(400).json("User Doesn't Exist"); //not a coordinator
}

function redirectIfLoggedIn(req, res, next) { //Middleware to check if user is logged in
  if (req.user) //check if user is authenticated
    return res.redirect("/home"); //redirect to homepage
  else
    return next(); //if not authenticated, redirect to login page
}


module.exports = {isLoggedIn,isCoordinator,redirectIfLoggedIn}