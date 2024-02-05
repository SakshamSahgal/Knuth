const { getBrowser, getOS, getDeviceType, getUserLocation } = require('./Analytics');

// This module is used to log user activity
async function GetUserActivity(req) {
    // const userActivity = {
    //     timestamp: new Date(),
    //     method: req.method,
    //     url: req.url,
    //     headers: req.rawHeaders,
    //     clientIP: req.socket.remoteAddress,
    //     isAuthenticated: req.isAuthenticated(),
    //     userId: req.user ? req.user.id : null,
    //     userName: req.user ? req.user.displayName : null,
    //     // Add other relevant information as needed
    //   };
    //   console.log(userActivity);
    // Access user agent information from req.useragent
    const userAgentInfo = req.useragent;
    // console.log(userAgentInfo);

    let template = {
        browserInfo: getBrowser(userAgentInfo.browser),
        osInfo: getOS(userAgentInfo),
        ip: req.ip,
        deviceTypeInfo: getDeviceType(userAgentInfo),
        locationData: await getUserLocation(req.ip)
    }
    console.log(template);
}

module.exports = { GetUserActivity };