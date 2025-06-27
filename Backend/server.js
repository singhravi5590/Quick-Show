import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from './inngest/inngest.js';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// API Routes
app.get('/', (req, res) => res.send("Server is live"));
app.use("/api/inngest", serve({ client: inngest, functions }));


connectDb().then(() => {
    console.log("Database Connected Successfully");  
    app.listen(port, () => {console.log("Port Started on 3000")},);

})