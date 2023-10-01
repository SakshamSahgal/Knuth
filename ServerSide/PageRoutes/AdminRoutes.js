module.exports = (app) => {

    const {isLoggedIn,isAdmin} = require("../Middlewares.js");
    const {countDocuments,readwithSortDB} = require("../MongoOperations.js");
    const path = require("path");

    app.get("/admin/users",isLoggedIn,isAdmin, async (req, res) => {
        
        let template = {
            users : await readwithSortDB("Main", "Users", {},{LastVisited : -1}), //Sort by LastVisited in descending order
            userCount : await countDocuments("Main", "Users", {}),
            online : 0,
            offline : 0
        }

        for(user of template.users) {
            user.ActivityStatus = isUserOnline(user.LastVisited);
            user.ActivityStatus == "ONLINE" ? template.online++ : template.offline++;
            user.timeSinceLastActive = Math.round((new Date() - user.LastVisited) / 60000); //Calculate the time since last active in minutes
        }
        res.render(path.join(__dirname,"..","..","ClientSide","Users.ejs"), template);

    });

    app.get("/admin/subscribers",isLoggedIn,isAdmin, async (req, res) => {

        let template = {
            subscribers : await readwithSortDB("Main", "Subscribers", {},{subscribedOn : -1}), //Sort by subscribedOn in descending order
        }
        res.render(path.join(__dirname,"..","..","ClientSide","Subscribers"), template);
    })

    function isUserOnline(targetDate) {

        const fiveMinutesAgo = new Date(); // Calculate the date 5 minutes ago
        fiveMinutesAgo.setTime(fiveMinutesAgo.getTime() - 5 * 60 * 1000); // 5 minutes in milliseconds

        // Compare the target date with the date 5 minutes ago
        if (targetDate.getTime() < fiveMinutesAgo.getTime()) {
            return "OFFLINE"
        } else {
            return "ONLINE"
        }

    }
}