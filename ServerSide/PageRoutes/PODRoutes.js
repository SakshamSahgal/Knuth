module.exports = (app) => {

    const crypto = require('crypto');
    const path = require('path');
    const { isLoggedIn, isCoordinator } = require("../Middlewares.js");
    const { readDB, writeDB, SkipRead, countDocuments} = require("../MongoOperations.js");
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
            platforms : ["Codeforces","Atcoder","Codechef","Hackerrank","HackerEarth","SPOJ"],
            selectedPlatformType : "Codeforces",
            emailTo: req.user.emails[0].value,
            coordinator : (coordinators.length > 0) ,
            problems : await SkipRead("Main","POD",{},{ postedOn: -1 },toSkip,Number(process.env.limitPerPage)),
            NumberOfPages : numberOfPage,
            CurPage : curPage,
        }

        res.render(path.join(__dirname,"..","..","ClientSide","pod.ejs"),template);
    })

    app.post("/postPOD",upload.none(),multerErrorHandling,isLoggedIn,isCoordinator,updateLastActivity, async (req, res) => {
        console.log(req.body);


        let POD = {
            id : crypto.randomUUID(),
            title : req.body.title,
            rating : req.body.rating,
            link : req.body.link,
            platform : req.body.platform,
            platformicon : (await readDB("Resources","CustomIcons",{platform : req.body.platform}))[0].image,
            AnnounceToSubscribers : (req.body.AnnounceToSubscribers) ? true : false,
            userPosted: {
                name: req.user.displayName,
                email: req.user.emails[0].value,
                profilePicture: req.user.photos[0].value
            },
            postedOn: new Date,
        }

        console.log(POD)

        const result = await writeDB("Main","POD",POD);
        console.log(result);




        res.send("posted POD")
    })
}