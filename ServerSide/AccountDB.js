const { readDB, writeDB, updateDB, deleteDB } = require("./MongoOperations.js"); //including the MongoOperations.js file (for the DB operations)

function captureAccount(profile) //function that checks if account already visited the site, if not, adds it to the DB of users
{
    readDB("Main", "Users", { "email": profile.emails[0].value }).then((users) => { //querrying DB to check if the email of the logged in user is present in the users list
        if (users.length == 0) //if not present, add it to the DB
        {
            console.log("User " + profile.emails[0].value + " Doesn't already exist in DB (◞╭╮◟)")

            const user = {
                email: profile.emails[0].value,
                displayName: profile.displayName,
                givenName: profile.name.givenName,
                familyName: profile.name.familyName,
                photo: profile.photos[0].value,
                codeforces_ID: "",
                codechef_ID: "",
                atcoderID: "",
                leetcodeID: "",
                Designation: "Member"
            }

            readDB("Main", "Coordinators", { "list.gmail": (profile.emails[0].value) }).then((found) => { //Querrying DB to check if the user is a coordinator

                // console.log(found)

                if (found.length > 0) { //if this email is found in the coordinators list, then the user is a coordinator
                    user.Designation = "Coordinator";
                } //if user is a coordinator

                writeDB("Main", "Users", user).then((result) => { //adding the user to the DB
                    console.log("User " + profile.emails[0].value + " added to DB");
                }).catch((err) => {
                        console.log("Can't Write to Users DB to store new User");
                        console.log(err);
                    })

            }).catch((err) => {
                    console.log("Can't Read Coordinator DB to find Designation");
                    console.log(err);
                })
        }
        else {
            console.log("User Already Exists in DB")
        }
    }).catch((err) => {
            console.log("Can't Read Users DB");
            console.log(err);
        })
}
module.exports = { captureAccount }