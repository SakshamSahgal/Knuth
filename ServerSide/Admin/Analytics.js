const axios = require('axios');

//function to get the browser information Object
function getBrowser(browser) {

    let browserInfo = {
        name: browser
    }
    return browserInfo;
}

function getOS(os) {

    let osInfo = {
        name: os.os
    }
    return osInfo;
}

function getDeviceType(userAgentInfo) {

    DeviceTypeInfo = {
    }

    if (userAgentInfo.isMobile) {
        DeviceTypeInfo.name = "Mobile"
    } else if (userAgentInfo.isTablet) {
        DeviceTypeInfo.name = "Tablet"
    } else if (userAgentInfo.isDesktop) {
        DeviceTypeInfo.name = "Desktop"
    } else {
        DeviceTypeInfo.name = "Unknown"
    }

    return DeviceTypeInfo;
}

const getUserLocation = async (ip) => {

    const ipAddress = ip; //IPv6-mapped IPv4 address
    console.log("IP  : ")
    console.log(ipAddress);
    
    
    try {
        const ipv4Address = ipAddress.split(':').pop();
        console.log(ipAddress + " " + ipv4Address);
        
        const response = await axios.get(`https://ipinfo.io/${ipv4Address}/json`);
        const locationData = response.data;
        // console.log(locationData)
        //erase the ip, and readme fields
        delete locationData.ip;
        delete locationData.readme;
        delete locationData.loc;

        locationData.latitude = locationData.loc.split(',')[0];
        locationData.longitude = locationData.loc.split(',')[1];
        return locationData;
    } catch (error) {
        console.error(error);
        console.log("req failed")
        return null;
    }
};

module.exports = { getBrowser, getOS, getDeviceType, getUserLocation };