import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/index.ts';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const otpTransactions = new Map<string, string>();

app.post('/auth/akedly/send', async (req, res) => {
  const { phoneNumber, powSolution, turnstileToken } = req.body;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-end-user-ip': req.ip ?? '',
  };

  const r = await fetch('https://api.akedly.io/api/v1.2/transactions/send', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      APIKey: process.env.AKEDLY_API_KEY,
      pipelineID: process.env.AKEDLY_PIPELINE_ID,
      verificationAddress: { phoneNumber },
      powSolution,
      turnstileToken,
    }),
  });
   const data = await r.json();

  otpTransactions.set(data.data.transactionReqID, phoneNumber);

  res.json(data);});




app.post("/auth/akedly/verify", async (req, res) => {
  const { transactionReqID, otp } = req.body;

  const r = await fetch(
    "https://api.akedly.io/api/v1.2/transactions/verify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionReqID, otp }),
    }
  );

  const data = await r.json();

  if (!r.ok) {
    return res.status(r.status).json(data);
  }

  const phoneNumber = otpTransactions.get(transactionReqID);

  if (!phoneNumber) {
    return res.status(400).json({
      message: "Transaction not found",
    });
  }

  otpTransactions.delete(transactionReqID);

  const resetToken = jwt.sign({
    phone: phoneNumber,
    purpose: "reset-password",
  }, process.env.TOKEN_SECRET_KEY!, { expiresIn: '1h' });

  return res.json({
    status: "success",
    resetToken,
  });
});

export default app;
