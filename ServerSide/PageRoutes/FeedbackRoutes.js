
module.exports = (app) => {

    const path = require('path');
    const {isLoggedIn,updateLastActivity } = require("../Middlewares.js");
    const {upload, multerErrorHandling } = require("../UploadImage/multer.js");
    const {writeDB} = require("../MongoOperations");
    const feedbackTypes = ["Improvement","Suggestion","Appreciation","Bug Report","User Experience (UX)","Content Quality","Feature Request","Accessibility","Other"]

    app.get("/feedback",isLoggedIn,updateLastActivity, (req, res) => { 

        console.log(req.user.emails[0].value + " is viewing the feedback page")

        let template = {
            page: "feedback",
            emailTo: req.user.emails[0].value,
            feedbackTypes : feedbackTypes,
            selectedFeedbackType: "Appreciation",
        }
        res.render(path.join(__dirname,"..","..","ClientSide","feedback.ejs"),template);
    })


    //middleware to check if the feedback contents are valid
    const feedbackContentCheck = (req,res,next) => {


           if(!feedbackTypes.includes(req.body.feedbackType)){
                return res.send("invalid feedback type");
            }
            
            if(req.body.feedback.length < 1){
                return res.send("feedback too short");
            }

            if(req.body.feedback.length > 1000){
                return res.send("feedback too long");
            }

            next();
    }

    app.post("/postFeedback",upload.none(),multerErrorHandling,isLoggedIn,updateLastActivity, feedbackContentCheck, (req, res) => {
        console.log(req.body)
        let feedback = {
            userPosted : {
                email : req.user.emails[0].value,
                photo : req.user.photos[0].value,
                name : req.user.displayName,
            },
            feedbackType: req.body.feedbackType,
            feedbackContent: req.body.feedback,
            PostedsDate: new Date(),
        }

        console.log(feedback)

        writeDB("Main","FeedBack",feedback).then((result) => {
            res.send("Feedback Posted Successfully")
        }).catch((err) => {
            console.log(err)
           res.send("Can't post Feedback, DB error");
        })

    })
}