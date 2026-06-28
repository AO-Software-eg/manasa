import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/index.ts';

const app = express();
app.use(cookieParser());

if (!process.env.FRONTEND_LOCAL_URL) {
  throw new Error(
    'Frontend server URL not set in environment variables, no authorized origin.',
  );
}

app.use(
  cors({
    origin: process.env.FRONTEND_LOCAL_URL,
    credentials: true,
  }),
);

app.use('/', apiRouter);

export default app;
