import express, { type Request, type Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { scalarDocs } from './docs/scalar.ts';
import apiRouter from './routes/index.ts';

const app = express();
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

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

app.use('/docs', scalarDocs);

export default app;
