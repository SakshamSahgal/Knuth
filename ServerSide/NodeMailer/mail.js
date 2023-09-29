var nodemailer = require('nodemailer'); //using Node Mailer Module


async function Mail(MailData) { //function that sends email

    console.log(MailData);
    console.log("I am sending mail");
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NodeMailerEmail,
          pass: process.env.NodeMailerAppPassword //I am using App password (enabled 2 step verification first)
        },
      });
      
      var mailOptions = {
        from: process.env.NodeMailerEmail,
        to: MailData.to,
        subject: MailData.subject,
        text: MailData.message,
        attachments: MailData.images
      };
      
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
            console.log("Successfully Send!");
        }
      });
}

module.exports = {Mail};