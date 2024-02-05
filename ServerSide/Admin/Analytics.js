const axios = require('axios');

//function to get the browser information Object
function getBrowser(browser) {

    let browserInfo = {
        name: browser
    }

    // console.log(browser)

    // if (fs.existsSync(path.join(__dirname, "..", "ClientSide", "Static", "GUI", "Browser", browser + ".png")))
    //     browserInfo.logo = path.join("GUI", "Browser", browser + ".png")
    // else
    //     browserInfo.logo = path.join("GUI", "Browser", "default.png")

    return browserInfo;
}

function getOS(os) {

    let osInfo = {
        name: os.os
    }

    // console.log(os)


    // if (os.isAndroid)
    //     osInfo.logo = path.join("GUI", "OS", "Android.png")
    // else if (os.isWindows)
    //     osInfo.logo = path.join("GUI", "OS", "Windows.png")
    // else if (os.isLinux || os.isLinux64)
    //     osInfo.logo = path.join("GUI", "OS", "Linux.png")
    // else if (os.isMac)
    //     osInfo.logo = path.join("GUI", "OS", "Mac.png")
    // else if (os.isIOS)
    //     osInfo.logo = path.join("GUI", "OS", "IOS.png")
    // else
    //     osInfo.logo = path.join("GUI", "OS", "Default.png")

    return osInfo;
}

function getDeviceType(userAgentInfo) {

    DeviceTypeInfo = {
    }

    if (userAgentInfo.isMobile) {
        DeviceTypeInfo.name = "Mobile"
        // DeviceTypeInfo.logo = path.join("GUI", "DeviceType", "Mobile.png")
    } else if (userAgentInfo.isTablet) {
        DeviceTypeInfo.name = "Tablet"
        // DeviceTypeInfo.logo = path.join("GUI", "DeviceType", "Tablet.png")
    } else if (userAgentInfo.isDesktop) {
        DeviceTypeInfo.name = "Desktop"
        // DeviceTypeInfo.logo = path.join("GUI", "DeviceType", "Desktop.png")
    } else {
        DeviceTypeInfo.name = "Unknown"
        // DeviceTypeInfo.logo = path.join("GUI", "DeviceType", "Default.png")
    }

    return DeviceTypeInfo;
}

const getUserLocation = async (ip) => {

    const ipAddress = ip; //IPv6-mapped IPv4 address
    console.log("IP  : ")
    console.log(ipAddress);
    const ipv4Address = ipAddress.split(':').pop();
    console.log(ipAddress + " " + ipv4Address);

    try {
        const response = await axios.get(`https://ipinfo.io/${ipv4Address}/json`);
        const locationData = response.data;
        console.log(locationData)
        locationData.latitude = locationData.loc.split(',')[0];
        locationData.longitude = locationData.loc.split(',')[1];
        return locationData;
    } catch (error) {
        // console.error(error);
        console.log("req failed")
        return null;
    }
};

module.exports = { getBrowser, getOS, getDeviceType, getUserLocation };