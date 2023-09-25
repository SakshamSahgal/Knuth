const { readDB } = require("./MongoOperations");

module.exports = (app) => {

const {readDB} = require("./MongoOperations.js");
const {isLoggedIn} = require("./Middlewares.js")
const path = require("path");

app.get("/ConnectWithUs",isLoggedIn,(req,res) => {
    
    readDB("Main","ConnectWithUs",{}).then((result) => {

        // console.log(result)

        if(result.length == 0)
        {
            console.log("No Data found");

            let template = {
                page: "connectWithUs",
                emailTo: req.user.emails[0].value,
                Telegram: null,
                WhatsApp: null,
                Discord: null,
                GitHub: null,
                LinkedIn: null,
                LinkTree: null, 
                Codeforces: null,
            }

            res.render(path.join(__dirname,"..","ClientSide","ConnectWithUs"),template);
        }
        else
        {
            let template = {
                page: "connectWithUs",
                emailTo: req.user.emails[0].value,
                Telegram: result[0].Telegram,
                WhatsApp: result[0].WhatsApp,
                Discord: result[0].Discord,
                GitHub: result[0].GitHub,
                LinkedIn: result[0].LinkedIn,
                LinkTree: result[0].LinkTree, 
                Codeforces: result[0].Codeforces,
            }
          
            res.render(path.join(__dirname,"..","ClientSide","ConnectWithUs"),template);
        }
    }).catch((err) => {
        
        console.log(err);

        let template = {
            page: "connectWithUs",
            emailTo: req.user.emails[0].value,
            Telegram: null,
            WhatsApp: null,
            Discord: null,
            GitHub: null,
            LinkedIn: null,
            LinkTree: null, 
            Codeforces: null,
        }

        res.render(path.join(__dirname,"..","ClientSide","ConnectWithUs"),template);
    })
  });

}