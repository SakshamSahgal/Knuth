const {readDB,updateDB} = require("./MongoOperations.js"); //including the MongoOperations.js file (for the DB operations)

function isLoggedIn(req, res, next) { //Middleware to check if user is logged in
    if (req.user) //check if user is authenticated
       next();
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
                  return res.send("you are not coordinator");
          }).catch((err) => {
              console.log("Cant' Read DB");
              return res.send("Cant' Read DB");
          })
  }
  else
    res.status(400).json("User Doesn't Exist"); //not a coordinator
}

function redirectIfLoggedIn(req, res, next) { //Middleware to check if user is logged in
  if (req.user) //check if user is authenticated
    return res.redirect("/home"); //redirect to homepage
  else
    next(); //if not authenticated, redirect to login page
}

function updateLastActivity(req,res,next) //middleware to update the last activity of the user
{
    updateDB("Main", "Users", { "email": req.user.emails[0].value }, { $set: { LastVisited: new Date() } }).then((result) => { //if it is present then just update the lastvisited in DB
        console.log("last activity of " + req.user.emails[0].value + " updated in DB");
        next();
    }).catch((err) => {
            console.log("Can't Update Users DB to update User activity of " + req.user.emails[0].value);
            console.log(err);
            next();
    })
}
function isAdmin(req,res,next) //middleware to check if currently logged in user is a admin
{
   readDB("Main", "Admins", {"email": req.user.emails[0].value}).then((admins) => { //querrying DB to check if the email of the logged in user is present in the admins collection
           if(admins.length > 0)
               next();
           else
               return res.send("you are not admin");
       }).catch((err) => {
           console.log("Cant' Read DB");
           return res.send("Cant' Read DB");
       })
}

module.exports = {isLoggedIn,isCoordinator,redirectIfLoggedIn,updateLastActivity,isAdmin}