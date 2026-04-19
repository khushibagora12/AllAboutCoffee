import dotenv from 'dotenv';
dotenv.config();

import { User } from '../db/DB.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

import { Router } from "express";
const router = Router()

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client();

router.post('/google_auth', async (req, res) => {
    const { credential, client_id } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log("payload: ", payload)

        const username = payload.name;
        const email = payload.email;
        const password = payload.sub;
        const isVerified = payload.email_verified;

        if (isVerified) {
            const user = await User.findOne({ email: email });
            if (user) {
                const token = await jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '12h' });
                res.json({ message: 'Logged in successfully', token: token, userId: user._id.toString(), username: user.username });
                return;
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await User.create({
                    username,
                    email,
                    password: hashedPassword
                });
                if (newUser)
                    return res.json({ message: 'User created successfully' });
            }
        }
    } catch (error) {
        console.log(error)
    }

})
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
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