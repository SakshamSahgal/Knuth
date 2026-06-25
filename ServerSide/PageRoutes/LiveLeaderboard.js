const path = require("path");
const { readDB, writeDB, updateDB, deleteDB } = require("../MongoOperations.js");
const { isLoggedIn, updateLastActivity, isCoordinator } = require("../Middlewares.js");
const { updateLog } = require("../Admin/UserActivty.js");

module.exports = (app) => {

    app.get("/leaderboard", isLoggedIn, updateLastActivity, async (req, res) => {
        try {
            updateLog(req, "Accessed the Leaderboard page");
            const email = req.user.emails[0].value;
            const coordinators = await readDB("Main", "Coordinators", { "list.gmail": email });
            const isAuthorized = coordinators.length > 0;

            const leaderboards = await readDB("Main", "Leaderboards", {});

            const leaderboardData = {};
            const contests = [];
            leaderboards.forEach(doc => {
                if (doc.contestName) {
                    leaderboardData[doc.contestName] = doc.leaderboard || [];
                    contests.push({ contestName: doc.contestName, entriesCount: (doc.leaderboard || []).length });
                }
            });

            res.render(path.join(__dirname, "..", "..", "ClientSide", "Leaderboard", "Leaderboard.ejs"), {
                page: "leaderboard",
                emailTo: req.user.emails[0].value,
                leaderboardData,
                isAuthorized,
                contests
            });
        } catch (err) {
            console.error(err);
            res.send("Error in fetching leaderboard data");
        }
    });

    app.post("/api/upload-leaderboard", isLoggedIn, isCoordinator, async (req, res) => {
        const contestNameRaw = req.body?.contestName;
        if (typeof contestNameRaw !== "string") {
            return res.status(400).json({ success: false, error: "contestName must be a string" });
        }
        const contestName = contestNameRaw.trim();
        if (!contestName) {
            return res.status(400).json({ success: false, error: "contestName is required" });
        }

        const { leaderboardData } = req.body;
        if (!leaderboardData || (typeof leaderboardData !== "object" && !Array.isArray(leaderboardData))) {
            return res.status(400).json({ success: false, error: "leaderboardData must be an object or array" });
        }

        try {
            const raw = leaderboardData.models || leaderboardData.leaderboard || (Array.isArray(leaderboardData) ? leaderboardData : []);
            const mapped = raw.map(e => ({
                rank: parseInt(e.rank) || 0,
                username: e.hacker || e.username || e.name || '',
                score: parseInt(e.score) || 0,
                time_taken: parseInt(e.time_taken || e.time || 0) || 0
            }));

            const existing = await readDB("Main", "Leaderboards", { contestName });
            if (existing.length > 0) {
                return res.json({ success: false, error: "Contest already exists" });
            }

            mapped.sort((a, b) => {
                if (a.rank !== b.rank) return a.rank - b.rank;
                if (b.score !== a.score) return b.score - a.score;
                return a.time_taken - b.time_taken;
            });

            await writeDB("Main", "Leaderboards", { contestName, leaderboard: mapped, lastSyncedAt: new Date(), uploadMethod: "json_paste" });
            updateLog(req, "Uploaded leaderboard for contest " + contestName);

            res.json({ success: true, message: `Stored ${mapped.length} entries for ${contestName}` });
        } catch (err) {
            res.json({ success: false, error: err.message });
        }
    });

    app.post("/api/delete-contest", isLoggedIn, isCoordinator, async (req, res) => {
        const contestNameRaw = req.body?.contestName;
        if (typeof contestNameRaw !== "string") {
            return res.status(400).json({ success: false, error: "contestName must be a string" });
        }
        const contestName = contestNameRaw.trim();
        if (!contestName) {
            return res.status(400).json({ success: false, error: "contestName is required" });
        }

        try {
            await deleteDB("Main", "Leaderboards", { contestName });
            updateLog(req, "Deleted contest " + contestName);
            res.json({ success: true, message: `Deleted ${contestName}` });
        } catch (err) {
            res.json({ success: false, error: err.message });
        }
    });
};