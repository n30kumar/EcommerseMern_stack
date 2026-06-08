import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export const verifyEmail = async (email, token) => {
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
    const mailConfigurations = {

    
    from: process.env.MAIL_USER,

    to: email,

    
    subject: 'Email Verification',
    
    
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:3000/verify/${token} 
           Thanks`
};
transporter.sendMail(mailConfigurations, function(error, info){
    if (error) {
        // Do not crash the app on SMTP errors; just log them.
        console.error('Error sending verification email:', error);
        return;
    }
    console.log('Email Sent Successfully');
    console.log(info);
});
}








