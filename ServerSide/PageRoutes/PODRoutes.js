const { chownSync } = require('fs');

module.exports = (app) => {

    const crypto = require('crypto');
    const path = require('path');
    const { isLoggedIn, isCoordinator } = require("../Middlewares.js");
    const { readDB, writeDB,deleteDB, SkipRead, countDocuments} = require("../MongoOperations.js");
    const { updateLastActivity } = require("../Middlewares.js");
    const {upload, multerErrorHandling } = require("../UploadImage/multer.js");

    app.get("/pod/:page?",isLoggedIn,updateLastActivity,async (req, res) => {

        var NoOfEntries = await countDocuments("Main","POD",{}) //Counting the number of entries in the database     
        var numberOfPage = Math.ceil(Number(NoOfEntries)/Number(process.env.limitPerPage)) //Calculating the number of pages
        var curPage = (req.params.page == undefined) ? 1 : Math.max(Math.min(Number(req.params.page),numberOfPage),1) //Clamping the page number between 1 and 10
        var toSkip = (curPage - 1) * Number(process.env.limitPerPage);

        console.log(req.user.emails[0].value + " is viewing the POD page " + curPage)
        
        var coordinators = await readDB("Main", "Coordinators", { "list.gmail": req.user.emails[0].value }); //querrying DB to check if the email of the logged in user is present in the coordinators list

        let template = {
            page: "pod", //to tell the navbar to highlight POD
            platforms : ["Codeforces","Atcoder","Codechef","Hackerrank","HackerEarth","SPOJ","Leetcode","CSES","GFG"],
            selectedPlatformType : "Codeforces",
            emailTo: req.user.emails[0].value,
            coordinator : (coordinators.length > 0) ,
            problems : await SkipRead("Main","POD",{},{ postedOn: -1 },toSkip,Number(process.env.limitPerPage)),
            NumberOfPages : numberOfPage,
            CurPage : curPage,
        }
        res.render(path.join(__dirname,"..","..","ClientSide","POD.ejs"),template);
    })

    //
    const checkParameters = (req, res, next) => { //middleware to check the length of the fields
            
        if(req.body.title.length > parseInt(process.env.TitleLength)) //checking if the title is too long
            return res.send("Title is too long");
        if(req.body.rating.length > parseInt(process.env.RatingLength)) //checking if the rating is too long
            return res.send("Rating is too long");
        if(req.body.title.length == 0)                                //checking if the title is too short
            return res.send("Title is too short");
        if(req.body.rating.length == 0)                               //checking if the rating is too short
            return res.send("rating is too short");
            
        next();
    }

    app.post("/postPOD",upload.none(),multerErrorHandling,isLoggedIn,isCoordinator,updateLastActivity,checkParameters, async (req, res) => {

        // console.log(req.body);

        let POD = {
            id : crypto.randomUUID(),
            title : req.body.title,
            rating : req.body.rating,
            link : req.body.link,
            platform : req.body.platform,
            platformicon : "/GUI/Icons/" + req.body.platform + ".png",
            AnnounceToSubscribers : (req.body.AnnounceToSubscribers) ? true : false,
            userPosted: {
                name: req.user.displayName,
                email: req.user.emails[0].value,
                profilePicture: req.user.photos[0].value
            },
            postedOn: new Date,
        }
        
        console.log(req.user.emails[0].value + " is posting the POD " + POD.id)
        
        if(POD.AnnounceToSubscribers) //if the user wants to announce the POD to the subscribers
        {
            let MailData = {
                to : [],
                subject : "Knuth Progarming Hub : Problem of the Day",
                message : "Problem of the Day is \n\n Problem Name : " + POD.title + "\n\n Problem Link : " + POD.link + "\n\n" + "Happy Coding!",
                images : []
            }
            
            let subscribers = await readDB("Main","Subscribers",{}); //reading the subscribers list

            for (let subscriber of subscribers) { //sending mail to all the subscribers
                MailData.to.push(subscriber.email)
            }

            console.log(MailData)
            await writeDB("Main","Approvals",MailData);
        }
        try {
            await writeDB("Main","POD",POD);
            res.send("posted POD!")
        } catch (error) {
            console.log(error)
            return res.send("Error while posting POD")
        }
        
    })

    //delete POD route , takes POD id , deletes the POD from DB
    app.delete("/deletePOD/:id",isLoggedIn,isCoordinator,updateLastActivity, async (req, res) => {

        console.log(req.user.emails[0].value + " is deleting the POD " + req.params.id)
        readDB("Main", "POD", { "id": (req.params.id).toString() }).then(async (found) => { //finding if the POD exists 

            if(found.length == 0) //POD not found
                return res.send("POD not found");
            else
            {
                if(found[0].userPosted.email != req.user.emails[0].value) //this POD was not posted by this user
                    return res.send("You are not allowed to delete this POD becasue you are not the one who posted it");
                else
                {
                    const result = await deleteDB("Main","POD",{id : (req.params.id).toString()});
                    console.log(req.user.emails[0].value + " deleted the POD " + req.params.id)
                    // /console.log(result);
                    return res.send("deleted POD!")
                }
            }
        })

    })
}