import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/index.ts';

const app = express();
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_LOCAL_URL,
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);


app.use(express.json());

app.use('/', apiRouter);

export default app;