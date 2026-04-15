import dotenv from 'dotenv';
dotenv.config();

import { User } from '../db/DB.js';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

import { Router } from "express";
const router = Router()

const signupFormat = z.object({
    username: z.string({ error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input."})
    .min(3, { error: (iss) => `Username must have ${iss.minimum} characters or more` }),
    email: z.string().email({ error: "Invalid email"}),
    password: z.string({
        error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input."
    })
    .min(8, {error : "Password must be at least 8 characters"})
    .regex(/[a-z]/, {error : "Password must contain at least one small letter"})
    .regex(/[A-Z]/, {error : "Password must contain at least one capital letter"})
    .regex(/[0-9]/, {error : "Password must contain at least one number"})
    .regex(/[@#$&]/, {error : "Password must contain a special character (@#$&)"})
})
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, username.length)
        const parsed = signupFormat.safeParse({username, email, password});
        if(!parsed.success){
            return res.json({'message' : parsed.error.issues[0].message})
        }
        const user = await User.findOne({ email: email });
        if (user) {
            res.json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        if (newUser)
            res.json({ message: 'User created successfully' })
    }
    catch (err) {
        console.log(err);
        res.json({ message: 'Error creating user' })
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("user ", email, password); 

        const user = await User.findOne({ email: email });
        if (user) {
            const isVerified = await bcrypt.compare(password, user.password);
            if (!isVerified) {
                res.json({ message: 'Invalid credentials' });
                return;
            }
            const token = await jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '12h' });
            res.json({ message: 'logged in successfully', token: token, userId: user._id.toString(), username: user.username });
            return;
        }
        res.json({ message: 'User does not exist' });
    }
    catch (err) {
        console.log(err);
        res.json({ message: 'Error logging in' })
    }
})

export default router;