import { Router } from 'express';
const router = Router();
import nodemailer from 'nodemailer';

router.post('/validate', async (req, res) => {
    console.log('got request')
    try {
        const { number, their_email, email } = req.body;
        console.log(number, their_email, email)
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASS,
            },
        });
        // const subject = `Your number is ${number}. Enter this on the app`;
        const options = {
            from: process.env.EMAIL_FROM,
            to: [their_email],
            subject: "validation number",
            html: email,
        };

        await transporter.sendMail(options);
        res.json({ 'message': "Number sent to email" })
    } catch (e) {
        console.log(e)
    }
})
export default router;