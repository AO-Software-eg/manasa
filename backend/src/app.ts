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

app.get('/auth/akedly/challenge', async (_req, res) => {
  const r = await fetch(
    `https://api.akedly.io/api/v1.2/transactions/challenge` +
      `?APIKey=${process.env.AKEDLY_API_KEY}` +
      `&pipelineID=${process.env.AKEDLY_PIPELINE_ID}`,
  );
  res.status(r.status).json(await r.json());
});

app.post('/auth/akedly/send', async (req, res) => {
  const { phoneNumber, powSolution, turnstileToken } = req.body;
  const r = await fetch('https://api.akedly.io/api/v1.2/transactions/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-end-user-ip': req.ip,
    },
    body: JSON.stringify({
      APIKey: process.env.AKEDLY_API_KEY,
      pipelineID: process.env.AKEDLY_PIPELINE_ID,
      verificationAddress: { phoneNumber },
      powSolution,
      turnstileToken,
    }),
  });
  res.status(r.status).json(await r.json());
});

app.post('/auth/akedly/verify', async (req, res) => {
  const { transactionReqID, otp } = req.body;
  const r = await fetch('https://api.akedly.io/api/v1.2/transactions/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionReqID, otp }),
  });
  res.status(r.status).json(await r.json());
});

export default app;
