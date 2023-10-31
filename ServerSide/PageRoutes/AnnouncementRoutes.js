

module.exports = (app) => {

    crypto = require('crypto');
    const { writeDB, readDB, deleteDB, countDocuments, SkipRead } = require("../MongoOperations");
    const { isLoggedIn, isCoordinator, updateLastActivity } = require("../Middlewares.js");
    const path = require("path");
    const fs = require('fs');
    require("dotenv").config();
    const { upload, multerErrorHandling, TypeCheck } = require("../UploadImage/multer.js");
    const { uploadFile, deleteImageFromImgur } = require("../UploadImage/imgur.js");
    const {FieldLengthCheck} = require("../UploadImage/FormMidddlewares.js")

    app.get("/announcements/:page?", isLoggedIn, updateLastActivity, async (req, res) => {
      
        
        var NoOfEntries = await countDocuments("Main","Announcements",{}) //Counting the number of entries in the database     
        var numberOfPage = Math.ceil(Number(NoOfEntries)/Number(process.env.limitPerPage)) //Calculating the number of pages
        var curPage = (req.params.page == undefined) ? 1 : Math.max(Math.min(Number(req.params.page),numberOfPage),1) //Clamping the page number between 1 and 10
        var toSkip = (curPage - 1) * Number(process.env.limitPerPage);
        
        console.log(req.user.emails[0].value + " is viewing the announcements page " + curPage)
      //console.log("No of Entries " , NoOfEntries, "numberOfPage ", numberOfPage, "curPage " , curPage,"toSkip " ,toSkip)
      
      var coordinators = await readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }); //querrying DB to check if the email of the logged in user is present in the coordinators list
      
      let templateJson = {
        fileLimit: parseInt(process.env.ImageUploadLimit),
        fileSize: parseInt(process.env.ImageSizeLimitInBytes) / (1024 * 1024),
        page: "announcements",
        emailTo: req.user.emails[0].value,
        username: req.user.displayName,
        profilePicture: req.user.photos[0].value,
        coordinator: (coordinators.length > 0),
        announcements: await SkipRead("Main","Announcements",{},{ postedOn: -1 },toSkip,Number(process.env.limitPerPage)), //Reading the database
        NumberOfPages : numberOfPage,
        CurPage : curPage,
        SubscriptionState : await readDB("Main","Subscribers",{email : req.user.emails[0].value}).then((found) => {return found.length > 0}), //Checking if the user is subscribed to announcements
    }

    res.render(path.join(__dirname, "..", "..", "ClientSide", "Announcements"), templateJson);//sending the user data to the frontend

    })


    //Using multiple middlewares for the PostAnnouncements route
    //isLoggedIn : to check if the user is logged in
    //isCoordinator : to check if the user is a coordinator
    //upload.array("images", parseInt(process.env.ImageUploadLimit)) : multer middleware to upload the images
    //multerErrorHandling : to check if there are any errors in image upload like file size limit exceeded, or file limit exceeded
    //TypeCheck : to check if the uploaded files are of supported type
    //FieldLengthCheck : to check if the title and post fields are not empty and are of valid length
    //updateLastActivity : to update the last activity date time of user in DB

    app.post("/PostAnnouncements", isLoggedIn, isCoordinator, upload.array("images", parseInt(process.env.ImageUploadLimit)), multerErrorHandling, TypeCheck, FieldLengthCheck, updateLastActivity, async (req, res) => {

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
            postedOn: new Date,
            AnnounceToSubscribers : (req.body.AnnounceToSubscribers) ? true : false,
        }

        // console.log(Announcement)

        //uploading all the images to server one at a time
        for (let file of req.files) {
            let uploadedImgdata = await uploadFile(path.join(__dirname, "..", "..", "uploads", file.filename)); //uploading the image to imgur and getting the id , link and deletehash and then deleting from the server
            Announcement.images.push(uploadedImgdata);
        }

        //writing to DB to store the announcement posted
        writeDB("Main", "Announcements", Announcement).then(async (result) => {

            if (Announcement.AnnounceToSubscribers) { //if the coordinator wants to announce to subscribers

                    let subscribers = await readDB("Main", "Subscribers", {}); //reading the subscribers list
                    
                    let MailData = {
                        to : [],
                        subject : "Knuth Progarming Hub : " + Announcement.title,
                        message : Announcement.description,
                        images : []
                    }

                    for (let subscriber of subscribers) { //sending mail to all the subscribers
                        MailData.to.push(subscriber.email)
                    }

                    for(let image of Announcement.images) { //adding all the images to the mail
                        
                        let img = {
                            filename : image.link.split("/")[3],
                            path : image.link,
                        }

                        MailData.images.push(img)
                    }

                    console.log(MailData)
        
                    await writeDB("Main","Approvals",MailData);
                }
    
                return res.send("Announcement Posted")

        }).catch((err) => {
            console.log("Can't Write to Announcements ");
            console.log(err);
            res.send("Can't post Announcements, DB error");
        })

    })

    //delete announcement route , takes post id , deletes the images from igmur and then deletes the post from DB

    app.delete("/DeleteAnnouncement/:id", isLoggedIn, isCoordinator, updateLastActivity, (req, res) => {

        readDB("Main", "Announcements", { "id": (req.params.id).toString() }).then(async (found) => { //finding if the announcement exists 

            //console.log(found);

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

    app.post("/SubscribeAnnouncement", isLoggedIn, updateLastActivity, (req, res) => {

        console.log("subscribe requested by " + req.user.emails[0].value)
        
        readDB("Main", "Subscribers", { "email": req.user.emails[0].value }).then((found) => { //finding if the user is already subscribed

            if (found.length > 0) //user already subscribed
                res.send("You are already subscribed to Announcements");
            else { //user not subscribed

                let subscriber = {
                    email: req.user.emails[0].value,
                    name: req.user.displayName,
                    profilePicture: req.user.photos[0].value,
                    subscribedOn: new Date,
                }
                    
                writeDB("Main", "Subscribers", subscriber).then((result) => { //writing to DB to store the subscriber
                    res.send("Subscribed to Announcements")
                }).catch((err) => {
                    console.log("Can't Write to Subscribers ");
                    console.log(err);
                    res.send("Can't Subscribe to Announcements, DB error");
                })
            }
        })

    })

    app.delete("/UnsubscribeAnnouncement", isLoggedIn, updateLastActivity, (req, res) => {

        console.log("unsubscribe requested by " + req.user.emails[0].value)

        readDB("Main", "Subscribers", { "email": req.user.emails[0].value }).then((found) => { //finding if the user is already subscribed

            if (found.length > 0) { //user already subscribed

                deleteDB("Main", "Subscribers", { "email": req.user.emails[0].value }).then((result) => { //deleting the subscriber from DB
                    res.send("Unsubscribed from Announcements")
                })
                .catch((err) => {
                    console.log("Can't Delete from Subscribers ");
                    console.log(err);
                    res.send("Can't Unsubscribe from Announcements, DB error");
                })
            }
            else //user not subscribed
                res.send("You are not subscribed to Announcements");
        })
    });
}