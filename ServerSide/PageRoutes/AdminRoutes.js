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
            user.timeSinceLastActive = formatLastActive(Math.round(new Date() - user.LastVisited) / 1000); // Calculate the time since last active
        }
        res.render(path.join(__dirname,"..","..","ClientSide","AdminPages","Users.ejs"), template);
    });

    app.get("/admin/subscribers",isLoggedIn,isAdmin, async (req, res) => {

        let template = {
            subscribers : await readwithSortDB("Main", "Subscribers", {},{subscribedOn : -1}), //Sort by subscribedOn in descending order
        }
        res.render(path.join(__dirname,"..","..","ClientSide","AdminPages","Subscribers.ejs"), template);
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
    // Function to format the time since last active
    function formatLastActive(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        seconds %= 3600 * 24;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
    
        const formattedTime = [];
    
        if (days > 0) {
            formattedTime.push(`${days} days`);
        }
        if (hours > 0) {
            formattedTime.push(`${hours} hours`);
        }
        if (minutes > 0) {
            formattedTime.push(`${minutes} minutes`);
        }
        if (seconds > 0) {
            formattedTime.push(`${seconds} seconds`);
        }
    
        return formattedTime.join(' & ');
    }
}