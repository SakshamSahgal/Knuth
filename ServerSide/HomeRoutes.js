
module.exports = (app) => {

  crypto = require('crypto');
  const { readDB, writeDB, deleteDB } = require("./MongoOperations");
  const { isLoggedIn, isCoordinator } = require("./Middlewares.js");
  const { upload, multerErrorHandling, TypeCheck } = require("./UploadImage/multer.js");
  const { FieldLengthCheck } = require("./UploadImage/FormMidddlewares.js")
  const { uploadFile, deleteImageFromImgur } = require("./UploadImage/imgur.js");
  const path = require("path");
  require("dotenv").config();

  app.get("/home", isLoggedIn, (req, res) => { //protected route
    readDB("Main", "Events", {}).then((events) => { //querying DB to fetch all the events
      readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }).then((coordinators) => { //querrying DB to check if the email of the logged in user is present in the coordinators list

        let Template = {
          page: "home",
          emailTo: req.user.emails[0].value,
          events: events,
          coordinator: (coordinators.length > 0),
          fileLimit: parseInt(process.env.ImageUploadLimit),
          fileSize: parseInt(process.env.ImageSizeLimitInBytes) / (1024 * 1024)
        }

        res.render(path.join(__dirname, "..", "ClientSide", "home"), Template)

      }).catch((err) => {

        let Template = {
          page: "home",
          emailTo: req.user.emails[0].value,
          events: [],
          coordinator: false,
          fileLimit: parseInt(process.env.ImageUploadLimit),
          fileSize: parseInt(process.env.ImageSizeLimitInBytes) / (1024 * 1024)
        }

        res.render(path.join(__dirname, "..", "ClientSide", "home"), Template)

      })
    }).catch((err) => {

      let Template = {
        page: "home",
        emailTo: req.user.emails[0].value,
        events: [],
        coordinator: false,
        fileLimit: parseInt(process.env.ImageUploadLimit),
        fileSize: parseInt(process.env.ImageSizeLimitInBytes) / (1024 * 1024)
      }

      res.render(path.join(__dirname, "..", "ClientSide", "home"), Template)
    })

  });

  app.post("/postEvent", isLoggedIn, isCoordinator, upload.array("images", parseInt(process.env.ImageUploadLimit)), multerErrorHandling, TypeCheck, FieldLengthCheck, async (req, res) => {

    // console.log(req.body.title);
    // console.log(req.body.titleLink);
    // console.log(req.body.post);

    let Event = {
      id: crypto.randomUUID(),
      title: req.body.title,
      titleLink: req.body.titleLink,
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
      Event.images.push(uploadedImgdata);
    }

    //writing to DB to store the announcement posted
    writeDB("Main", "Events", Event).then((result) => {
      res.send("Event Posted")
    }).catch((err) => {
      console.log("Can't Write to Event ");
      console.log(err);
      res.send("Can't post Event, DB error");
    })
  })

  //delete Event route , takes post id , deletes the images from igmur and then deletes the post from DB

  app.delete("/DeleteEvent/:id", isLoggedIn, isCoordinator, (req, res) => {

    readDB("Main", "Events", { "id": (req.params.id).toString() }).then(async (found) => { //finding if the Event exists 

      // console.log(found);

      if (found.length > 0) { //Event found

        if (found[0].userPosted.email == req.user.emails[0].value) { //this Announcement was posted by this user only

          for (let image of found[0].images)  //deleting the images from imgur
            await deleteImageFromImgur(image.deletehash, process.env.imgurClientID);

          deleteDB("Main", "Events", { "id": (req.params.id).toString() }).then((result) => { //deleting the announcement from DB
            res.send("Event Deleted successfully")
          })
            .catch((err) => {
              console.log("Can't Delete from Events ");
              console.log(err);
              res.send("Can't Delete Event, DB error");
            })
        }
        else
          res.status(400).send("You can't delete this Event because it was not posted by you");
      }
      else
        res.status(400).send("Events Doesn't Exist");

    })

  })

};