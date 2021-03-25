const nodemailer = require("nodemailer");

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log(`error from sending email function: ${err}`);
        } else {
            console.log(`info succesed :${info.response}`);
        }
    });

    // console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
