import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';
import z from 'zod';
import { hashPassword } from './hash.ts'

import db, { getImageLink, getUserByEmail} from './database.ts';

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

// Routes
app
  .route('/images/:imageName')
  .get(async (req: Request<{ imageName: string }>, res: Response) => {
    try {
      const imageName = req.params.imageName;
      const result = await getImageLink(imageName);
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

app
  .route('/signup')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      res.status(415).send();
      return;
    }

    const signupSchema = z.object({
      email: z.email(),
      name: z.string().min(2, "Name is too short."),
      studentPhone: z.string().trim().regex(/^\+201[0125]\d{8}$/, "Invalid egyptian mobile phone number."),
      parentPhone: z.string().trim().regex(/^\+201[0125]\d{8}$/, "Invalid egyptian mobile phone number."),
      specialization: z.string().optional(),
      governorate: z.string("Governorate must be picked."),
      YearCombo: z.string("School Year must be picked."),
      password: z.string().min(6, "Password is too short."),
      confirmPassword: z.string().min(6, "Password is too short.")
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: "Password confirmation doesn't match."
    })
    .refine((data) => data.studentPhone !== data.parentPhone, {
      error: "Student and parent phone numbers must differ."
    });

    try {
      const data = req.body;
      signupSchema.parse(data);

      const existingUser = await getUserByEmail(data.email);
      if (existingUser) {
        res.status(400).json({
          'message': 'User already exists'
        });

        res.send();
        return;
      }

    } 
    catch (err) {
      console.log(err);
      res.status(415).send();
      return;
    }

    res.status(200).send();
  });

export default app;
