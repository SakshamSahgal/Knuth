const path = require("path");
const axios = require("axios");

module.exports = (app) => {
    
    app.get("/leaderboard", async (req, res) => {
        let leaderboardData={};
        try{
            //make a get request to the leaderboard API to get the leaderboard data with a cookie header
            leaderboardData = await axios.get('https://www.hackerrank.com/rest/contests/knuth-coding-round-1/leaderboard?offset=0&limit=1000',{
                headers: {
                    'User-Agent': 'PostmanRuntime/7.42.0', // use the same User-Agent as Postman, to avoid getting blocked by hackerrank servers
                }
            });
            console.log(leaderboardData.data);
            res.render(path.join(__dirname, "..", "..", "ClientSide", "Leaderboard", "Leaderboard.ejs"), leaderboardData.data);
        }catch(err){
            console.log(err);
            res.send("Error in fetching leaderboard data");
        }
    });
}