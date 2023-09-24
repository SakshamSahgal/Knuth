
const fs = require('fs');
require('dotenv').config();
const imgur = require('imgur');
const path = require('path');

async function uploadFile(localPath) {

    try {
        const json = await imgur.uploadFile(localPath); // Upload an image to Imgur asynchronously

        console.log(`Image ${localPath} uploaded successfully!`);
        console.log(json);

        fs.unlinkSync(localPath); // Deleting the file from the server

        return { id: json.data.id, link: json.data.link, deletehash: json.data.deletehash };
    } catch (err) {
        console.error('Error uploading image to Imgur:', err.message);
        fs.unlinkSync(localPath); // Deleting the file from the server
        return { id : null, link: null, deletehash: null };
    }
}

module.exports = {uploadFile}