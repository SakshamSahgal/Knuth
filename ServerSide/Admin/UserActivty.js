const { updateDB } = require('../MongoOperations');
const { getBrowser, getOS, getDeviceType, getUserLocation } = require('./Analytics');

// This module is used to log user activity
async function updateLog(req, log) {

    let userLog = {
        // email :  req.user.emails[0].value,
        timeStamp: new Date(),
        browserInfo: getBrowser(req.useragent.browser),
        osInfo: getOS(req.useragent),
        ip: req.ip,
        deviceTypeInfo: getDeviceType(req.useragent),
        locationData: await getUserLocation(req.ip),
        log: log
    }

    updateDB("Main", "Users", { "email": req.user.emails[0].value }, { $push: { "activityLog": userLog } }).then((result) => {
    }).catch((err) => {
        console.log("Can't Update Users DB to update User activity of " + req.user.emails[0].value);
        console.log(err);
    })

    // console.log(userLog);
}

module.exports = { updateLog };