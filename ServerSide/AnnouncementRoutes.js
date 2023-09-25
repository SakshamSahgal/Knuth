

module.exports = (app) => {

    crypto = require('crypto');
    const { writeDB, readDB, deleteDB } = require("./MongoOperations");
    const { isLoggedIn, isCoordinator } = require("./Middlewares.js");
    const path = require("path");
    const fs = require('fs');
    require("dotenv").config();
    const { upload, multerErrorHandling, TypeCheck } = require("./UploadImage/multer.js");
    const { uploadFile, deleteImageFromImgur } = require("./UploadImage/imgur.js");
    const {FieldLengthCheck} = require("./UploadImage/FormMidddlewares.js")

    app.get("/announcements", isLoggedIn, async (req, res) => {

        readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }).then(async (coordinators) => { //querrying DB to check if the email of the logged in user is present in the coordinators list

            let templateJson = {
                fileLimit: parseInt(process.env.ImageUploadLimit),
                fileSize: parseInt(process.env.ImageSizeLimitInBytes) / (1024 * 1024),
                page: "announcements",
                emailTo: req.user.emails[0].value,
                username: req.user.displayName,
                profilePicture: req.user.photos[0].value,
                coordinator: (coordinators.length > 0),
                announcements: await readDB("Main", "Announcements", {})
            }

            res.render(path.join(__dirname, "..", "ClientSide", "Announcements"), templateJson);//sending the user data to the frontend

        }).catch(async (err) => {

            let templateJson = {
                fileLimit: parseInt(process.env.ImageUploadLimit),
                fileSize: parseInt(process.env.ImageSizeLimitInBytes) / (1024 * 1024),
                page: "announcements", 
                emailTo: req.user.emails[0].value,
                username: req.user.displayName,
                profilePicture: req.user.photos[0].value,
                coordinator: false,
                Announcements: await readDB("Main", "Announcements", {})
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
    //FieldLengthCheck : to check if the title and post fields are not empty and are of valid length

    app.post("/PostAnnouncements", isLoggedIn, isCoordinator, upload.array("images", parseInt(process.env.ImageUploadLimit)), multerErrorHandling, TypeCheck, FieldLengthCheck, async (req, res) => {

        let Announcement = {
            id : crypto.randomUUID(),
            title: req.body.title,
            description: req.body.post,
            images: [],
            userPosted: {
                name: req.user.displayName,
                email: req.user.emails[0].value,
                profilePicture: req.user.photos[0].value
            },
            postedOn: new Date().toLocaleString(),
        }

        for (let file of req.files) {
            let uploadedImgdata = await uploadFile(path.join(__dirname, "..", "uploads", file.filename)); //uploading the image to imgur and getting the id , link and deletehash and then deleting from the server
            Announcement.images.push(uploadedImgdata);
        }



        //writing to DB to store the announcement posted
        writeDB("Main", "Announcements", Announcement).then((result) => {
            res.send("Announcement Posted")
        }).catch((err) => {
            console.log("Can't Write to Announcements ");
            console.log(err);
            res.send("Can't post Announcements, DB error");
        })
    })

    //delete announcement route , takes post id , deletes the images from igmur and then deletes the post from DB

    app.delete("/DeleteAnnouncement/:id", isLoggedIn, isCoordinator, (req, res) => {

        readDB("Main", "Announcements", { "id": (req.params.id).toString() }).then(async (found) => { //finding if the announcement exists 

            console.log(found);

            if (found.length > 0) { //announcement found

                if (found[0].userPosted.email == req.user.emails[0].value) { //this Announcement was posted by this user only

                    for (let image of found[0].images)  //deleting the images from imgur
                        await deleteImageFromImgur(image.deletehash, process.env.imgurClientID);

                    deleteDB("Main", "Announcements", { "id": (req.params.id).toString() }).then((result) => { //deleting the announcement from DB
                        res.send("Announcement Deleted successfully")
                    })
                    .catch((err) => {
                        console.log("Can't Delete from Announcements ");
                        console.log(err);
                        res.send("Can't Delete Announcements, DB error");
                    })
                }
                else
                    res.status(400).send("You can't delete this announcement because it was not posted by you");
            }
            else
                res.status(400).send("Announcement Doesn't Exist");

        })

    })
}