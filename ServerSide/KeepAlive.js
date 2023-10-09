module.exports = (app) => {

    const urlToPing = process.env.Host + "/ping";
    // console.log("URL to ping: " + urlToPing)
    const axios = require('axios');

    async function pingUrl() {
        try {
            const response = await axios.get(urlToPing, {
                headers: {
                    'pingedBy': 'Keep-Alive-Bot', // Custom header
                },
            });
            console.log(`Ping successful! Keep-Alive-Bot return status Status code: ${response.status}`);
        } catch (error) {
            console.error(`Ping failed: ${error.message}`);
        }
    }
    

    app.get("/ping", (req, res) => {

        if (req.headers.pingedby == "Keep-Alive-Bot") {
            console.log("Keep-Alive-Bot visited!");
        } else {
            console.log("Someone visited!");
        }

        res.send("pong");
    })

    setInterval(pingUrl, parseInt(process.env.PingBotDuration)); // Ping every 10 seconds
}