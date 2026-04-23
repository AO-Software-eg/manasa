import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';
import z, { ZodError } from 'zod';

import { hashPassword, verifyPassword } from './hash.ts';
import * as db from './database.ts';
import * as validation from './validation.ts';
import { sessionObject } from './session.ts';

const app = express();

if (!process.env.FRONTEND_LOCAL_URL) {
  throw new Error('Frontend server URL not set, no authorized origin.');
}

app.use(
  cors({
    origin: process.env.FRONTEND_LOCAL_URL,
    credentials: true,
  }),
);
app.use(sessionObject);

// Routes
app
  .route('/images/:imageName')
  .get(async (req: Request<{ imageName: string }>, res: Response) => {
    try {
      const imageName = req.params.imageName;
      const result = await db.getImageLink(imageName);
      if (result) {
        res.json({
          message: 'Found image',
          imageUrl: result,
        });
      } else {
        res.status(404).json({
          message: 'Image not found',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  });

app.route('/me').get(async (req: Request, res: Response) => {
  if (!req.session.user) {
    res.status(401).send();
    return;
  }

  res.status(200).json({
    sessionData: req.session.user,
  });
});

app
  .route('/signup')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      res.status(415).send();
      return;
    }

    try {
      const data = req.body;
      validation.signupSchema.parse(data);

      const existingUser = await db.getUserByEmail(data.email);
      if (existingUser) {
        res.status(400).json({
          message: 'User already exists',
        });
        return;
      }

      const passwordHash = await hashPassword(data.password);
      const user: db.User = {
        id: -1, // Doesn't matter, database creates the id
        email: data.email,
        name: data.name,
        studentPhone: data.studentPhone,
        parentPhone: data.parentPhone,
        specialization: data.specialization,
        governorate: data.governorate,
        year: data.YearCombo,
        passwordHash: passwordHash,
      };

      db.insertUser(user);
    } catch (err) {
      console.log(err);
      res.status(400).send();
      return;
    }

    res.status(200).send();
  });

app
  .route('/login')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      res.status(415).send();
      return;
    }

    if (req.session.user) {
      res.status(400).json({
        message: 'User is already logged in',
      });
      return;
    }

    try {
      const data = req.body;
      validation.loginSchema.parse(data);

      const user: db.User | null = await db.getUserByEmail(data.email);
      if (!user) {
        res.status(404).json({
          message: 'User does not exist',
        });
        return;
      }

      if ((await verifyPassword(user.passwordHash, data.password)) == false) {
        res.status(400).json({
          message: 'Incorrect password',
        });
        return;
      }

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: 'Invalid login data',
        });
        return;
      } else {
        console.log(err);
        res.status(500).send();
        return;
      }
    }

    res.status(200).send();
  });


app.route('/video/:videoId').get(async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { videoId } = req.params;

  try {
    const axios = (await import('axios')).default;

    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        ttl: 300,

        annotate: JSON.stringify([
          {
            type: "rtext",
            text: `ID: ${req.session.user.id}`,
            interval: 5000,
            alpha: 0.6,
            color: "#FFFFFF",   
            size: 18,           
            xpos: 50,          
            ypos: 50
          }
        ]),
      },
      {
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.json({
      otp: response.data.otp,
      playbackInfo: response.data.playbackInfo,
    });

  } catch (err: any) {
    console.log("ERROR:", JSON.stringify(err.response?.data, null, 2));

    return res.status(500).json(err.response?.data);
  }
});

export default app;
