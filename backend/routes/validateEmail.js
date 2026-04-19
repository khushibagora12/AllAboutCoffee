import { Router } from 'express';
const router = Router();
import nodemailer from 'nodemailer';
import { z } from 'zod';
import client from './redisClient.js';

const signupFormat = z.object({
    username: z.string({ error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input." })
        .min(3, { error: (iss) => `Username must have ${iss.minimum} characters or more` }),
    email: z.string().email({ error: "Invalid email" }),
    password: z.string({
        error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input."
    })
        .min(8, { error: "Password must be at least 8 characters" })
        .regex(/[a-z]/, { error: "Password must contain at least one small letter" })
        .regex(/[A-Z]/, { error: "Password must contain at least one capital letter" })
        .regex(/[0-9]/, { error: "Password must contain at least one number" })
        .regex(/[@#$&]/, { error: "Password must contain a special character (@#$&)" })
})

router.post('/validate', async (req, res) => {
    console.log('got request')
    try {
        const { username, email, password } = req.body;

        const parsed = signupFormat.safeParse({ username, email, password });
        if (!parsed.success) {
            return res.json({ 'message': parsed.error.issues[0].message })
        }

        const random = Math.floor(Math.random() * 10000);
        await client.set(email, random);
        const val = await client.get(email)
        console.log("val ", val)

        // await client.close()

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASS,
            },
        });
        const options = {
            from: process.env.EMAIL_FROM,
            to: [email],
            subject: "validation number",
            html: `<p>Your validation number:<p/> ${val} <br/> <p>Enter this in your application</p>`,
        };
        await transporter.sendMail(options);
        res.json({ 'message': "Number sent to email" })
    } catch (e) {
        console.log(e)
    }
    finally{
        await client.close()
    }
})

router.post(('/matchEmail'), async (req, res) => {
    console.log("in match email")
    try {
        const {their_email, number} = req.body;
        const val = await client.get(their_email)
        // console.log(val, typeof(val))
        // console.log(number, typeof(number))

        if(number === val){
            return res.json({"message" : "matched"})
        }else{
            return res.json({"message" : "number mismatched"})
        }
    } catch (error) {
        console.log(error)
    }
    finally{
        await client.close()
    }
})
export default router;