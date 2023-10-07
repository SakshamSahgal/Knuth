
const fs = require('fs');
require('dotenv').config();
const imgur = require('imgur');
const path = require('path');
const axios = require('axios');

async function uploadFile(localPath) {

    try {
        const json = await imgur.uploadFile(localPath); // Upload an image to Imgur asynchronously

        console.log(`Image ${localPath} uploaded successfully!`);
        //console.log(json);
        if(fs.existsSync(localPath))
            fs.unlinkSync(localPath); // Deleting the file from the server

        return { id: json.data.id, link: json.data.link, deletehash: json.data.deletehash };
    } catch (err) {
        console.error('Error uploading image to Imgur:', err.message);
        if(fs.existsSync(localPath))
            fs.unlinkSync(localPath); // Deleting the file from the server
        return { id: null, link: null, deletehash: null };
    }
}

async function deleteImageFromImgur(deleteHash, clientId) {
    try {
        const response = await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
            headers: {
                'Authorization': `Client-ID ${clientId}`,
            },
        });

        if (response.status === 200) {
            console.log('Image deleted successfully');
            return true; // Indicates successful deletion
        } else {
            console.error('Failed to delete image:', response.data);
            return false; // Indicates failure
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return false; // Indicates failure
    }
}

module.exports = { uploadFile , deleteImageFromImgur }