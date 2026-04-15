import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import {createServer} from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.FRONTEND_URL],
        methods: ['GET', 'POST']
    }
});

import cors from 'cors'; 
import connectDB from './db/connecDB.js';
import authRoutes from './routes/auth.js';
import userRoute from './routes/users.js';
import authMiddleware from './middleware/middleware.js';
import initSocket from './socket/server.js';

const port = process.env.PORT_NUMBER | 3000;
app.use(express.json());
app.use(cors());

connectDB()

app.use("/routes/auth", authRoutes)

app.use(authMiddleware)

initSocket(io)

app.use("/routes/users", userRoute)

httpServer.listen(port, () => {
    console.log('listening on 3000');
});
