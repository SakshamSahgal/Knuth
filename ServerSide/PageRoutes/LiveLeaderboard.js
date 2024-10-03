const path = require("path");
const axios = require("axios");
const { updateLog } = require("../Admin/UserActivty.js")
const { isLoggedIn, updateLastActivity } = require("../Middlewares.js");
const { readDB } = require("../MongoOperations.js")

module.exports = (app) => {

    app.get("/leaderboard", isLoggedIn, updateLastActivity, async (req, res) => { //protected route

        try {

            //update the user activity log for accessing the Leaderboard page
            updateLog(req, "Accessed the Leaderboard page");

            let Template = {
                page: "leaderboard",
                emailTo: req.user.emails[0].value,
            }

            let Contests = await readDB("Main", "Contests", {});

            let contestNames = Contests.map((contest) => contest.ContestName);

            let leaderboardData = {};

            //get the leaderboard data for each contest
            for (let contestName of contestNames) {
                //make a get request to the leaderboard API to get the leaderboard data with a cookie header
                let data = await axios.get(`https://www.hackerrank.com/rest/contests/${contestName}/leaderboard?offset=0&limit=1000`, {
                    headers: {
                        'User-Agent': 'PostmanRuntime/7.42.0', // use the same User-Agent as Postman, to avoid getting blocked by hackerrank servers
                    }
                });
                // console.log(data.data.models)
                leaderboardData[contestName] = data.data.models;
            }

            Template.leaderboardData = leaderboardData;

            res.render(path.join(__dirname, "..", "..", "ClientSide", "Leaderboard", "Leaderboard.ejs"), Template);
        } catch (err) {
            console.log(err);
            res.send("Error in fetching leaderboard data");
        }
    });
}