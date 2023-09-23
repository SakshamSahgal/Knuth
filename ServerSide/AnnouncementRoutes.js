

module.exports = (app) => {

    const { readDB } = require("./MongoOperations");
    const { isLoggedIn, isCoordinator } = require("./Middlewares.js");
    const path = require("path");
    const fs = require('fs');
    require("dotenv").config();
    const {upload,multerErrorHandling,TypeCheck} = require("./UploadImage/multer.js");

    app.get("/announcements", isLoggedIn, (req, res) => {

        readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }).then((coordinators) => { //querrying DB to check if the email of the logged in user is present in the coordinators list
            res.render(path.join(__dirname, "..", "ClientSide", "Announcements"), { fileLimit: parseInt(process.env.ImageUploadLimit) ,fileSize : parseInt(process.env.ImageSizeLimitInBytes)/(1024*1024),page: "announcements", emailTo: req.user.emails[0].value, username: req.user.displayName, profilePicture: req.user.photos[0].value, coordinator: (coordinators.length > 0) });//sending the user data to the frontend
        }).catch((err) => {
            res.render(path.join(__dirname, "..", "ClientSide", "Announcements"), {fileLimit: parseInt(process.env.ImageUploadLimit) ,fileSize : parseInt(process.env.ImageSizeLimitInBytes)/(1024*1024), page: "announcements", emailTo: req.user.emails[0].value, username: req.user.displayName, profilePicture: req.user.photos[0].value, coordinator: false });//sending the user data to the frontend
        })
    })


    app.post("/PostAnnouncements",isLoggedIn,isCoordinator,upload.array("images",parseInt(process.env.ImageUploadLimit)),multerErrorHandling,TypeCheck,  (req, res) => {

        let post = {
            title : req.body.title,
            description : req.body.post,
            images : [],
        }

        for(let i=0;i<req.files.length;i++)
        {
            let imgObj = {
                filename : req.files[i].path.split('-')[1],
                localPath : req.files[i].path,
            }
            post.images.push(imgObj);
        }

        console.log("post = ")
        console.log(post)
        res.send("Announcement Posted")

    })
};