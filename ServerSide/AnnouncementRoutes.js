

module.exports = (app) => {

    const { readDB, writeDB } = require("./MongoOperations");
    const { isLoggedIn, isCoordinator } = require("./Middlewares.js");
    const path = require("path");
    const fs = require('fs');
    require("dotenv").config();
    const { upload, multerErrorHandling, TypeCheck } = require("./UploadImage/multer.js");
    const { uploadFile } = require("./UploadImage/imgur.js");

    app.get("/announcements", isLoggedIn, (req, res) => {

        readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }).then((coordinators) => { //querrying DB to check if the email of the logged in user is present in the coordinators list

            let templateJson = {
                fileLimit: parseInt(process.env.ImageUploadLimit),
                fileSize: parseInt(process.env.ImageSizeLimitInBytes) / (1024 * 1024),
                page: "announcements", emailTo: req.user.emails[0].value,
                username: req.user.displayName,
                profilePicture: req.user.photos[0].value,
                coordinator: (coordinators.length > 0)
            }

            res.render(path.join(__dirname, "..", "ClientSide", "Announcements"), templateJson);//sending the user data to the frontend

        }).catch((err) => {

            let templateJson = {
                fileLimit: parseInt(process.env.ImageUploadLimit),
                fileSize: parseInt(process.env.ImageSizeLimitInBytes) / (1024 * 1024),
                page: "announcements", emailTo: req.user.emails[0].value,
                username: req.user.displayName,
                profilePicture: req.user.photos[0].value,
                coordinator: false
            }

            res.render(path.join(__dirname, "..", "ClientSide", "Announcements"), templateJson);//sending the user data to the frontend
        })
    })



    //Using multiple middlewares for the PostAnnouncements route
    //isLoggedIn : to check if the user is logged in
    //isCoordinator : to check if the user is a coordinator
    //upload.array("images", parseInt(process.env.ImageUploadLimit)) : multer middleware to upload the images
    //multerErrorHandling : to check if there are any errors in image upload like file size limit exceeded, or file limit exceeded
    //TypeCheck : to check if the uploaded files are of supported type


    app.post("/PostAnnouncements", isLoggedIn, isCoordinator, upload.array("images", parseInt(process.env.ImageUploadLimit)), multerErrorHandling, TypeCheck, async (req, res) => {

        let Announcement = {
            title: req.body.title,
            description: req.body.post,
            images: [],
        }

        for (let file of req.files) {
            let uploadedImgdata = await uploadFile(path.join(__dirname, "..", "uploads", file.filename)); //uploading the image to imgur and getting the id , link and deletehash and then deleting from the server
            Announcement.images.push(uploadedImgdata);
        }

        console.log(Announcement)

        //writing to DB to store the announcement posted
        writeDB("Main", "Announcements", Announcement).then((result) => {
            // console.log(result)
            res.send("Announcement Posted")
        }).catch((err) => {
            console.log("Can't Write to Announcements ");
            console.log(err);
            res.send("Can't post Announcements, DB error");
        })
    })
};