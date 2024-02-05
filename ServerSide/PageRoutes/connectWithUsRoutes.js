module.exports = (app) => {

const {readDB} = require("../MongoOperations.js");
const {isLoggedIn,updateLastActivity} = require("../Middlewares.js")
const path = require("path");
const { updateLog } = require("../Admin/UserActivty.js")

app.get("/ConnectWithUs",isLoggedIn,updateLastActivity,(req,res) => {
    
    updateLog(req, "Accessed the ConnectWithUs page")

    readDB("Main","ConnectWithUs",{}).then((result) => {

        // console.log(result)

        let template = {
            page: "connectWithUs",
            emailTo: req.user.emails[0].value,
            Telegram: (result.length == 0) ? null : result[0].Telegram,
            WhatsApp: (result.length == 0) ? null : result[0].WhatsApp,
            Discord: (result.length == 0) ? null : result[0].Discord,
            GitHub: (result.length == 0) ? null : result[0].GitHub,
            LinkedIn: (result.length == 0) ? null : result[0].LinkedIn,
            LinkTree: (result.length == 0) ? null : result[0].LinkTree, 
            Codeforces: (result.length == 0) ? null : result[0].Codeforces,
            Gmail: (result.length == 0) ? null : result[0].Gmail,
            Instagram: (result.length == 0) ? null : result[0].Instagram,
        }
          
            res.render(path.join(__dirname,"..","..","ClientSide","ConnectWithUs"),template);
        
    }).catch((err) => {
        
        console.log(err);

        let template = {
            page: "connectWithUs",
            emailTo: req.user.emails[0].value,
            Telegram: "",
            WhatsApp: "",
            Discord: "",
            GitHub: "",
            LinkedIn: "",
            LinkTree: "", 
            Codeforces: "",
            Gmail: "",
            Instagram: "",
        }

        res.render(path.join(__dirname,"..","..","ClientSide","ConnectWithUs"),template);
    })
  });

}