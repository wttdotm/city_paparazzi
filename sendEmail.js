const nodemailer = require("nodemailer");
require('dotenv').config()

const sendEmail = async (imagePaths, enteringOrLeaving = 'around', location = 'rando brooklyn') => {
    let testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "morristskolman@gmail.com",
            pass: process.env.GMAIL_APP_PASS,
        },
    });
    
    let email = await transporter.sendMail({
        from: `"CITY PAPARAZZI" ${testAccount.user}`, // sender address
        to: `morristskolman@gmail.com`, // list of recipients
        // subject: `You were spotted ${enteringOrLeaving} the ${location} traffic camera:`, // Subject line
        subject: `You were spotted near a traffic camera:`, // Subject line
        text: `Attached are your images ${enteringOrLeaving} ${location}`, // plain text body
        html: `<b>Attached are your images ${enteringOrLeaving} ${location}</b>`, // html body
        attachments : imagePaths.map(image => { 
            return {path : image}
            }
        )
    }, (error, info) => {
        if (error) {
        console.error("Error sending email: ", error);
        } else {
        console.log("Email sent: ", info.response);
        }
    });
}

module.exports = sendEmail