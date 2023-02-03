const sgMail = require('@sendgrid/mail')

function sendEmail(dest, message) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: dest, // Change to your recipient
        from: "engya306@gmail.com", // Change to your verified sender
        subject: 'Verification',
        text: 'verify your account',
        html: message,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = sendEmail;
