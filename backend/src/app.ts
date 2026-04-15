import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';
import z, { ZodError } from 'zod';

import { hashPassword, verifyPassword } from './hash.ts'
import db, { getImageLink, getUserByEmail, insertUser, type User} from './database.ts';
import * as validation from './validation.ts'

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
      } 
      else {
        res.status(404).json({
          message: 'Image not found',
        });
      }
    } 
    catch (err) {
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

    try {
      const data = req.body;
      validation.signupSchema.parse(data);

      const existingUser = await getUserByEmail(data.email);
      if (existingUser) {
        res.status(400).json({
          'message': 'User already exists'
        });
        return;
      }

      const passwordHash = await hashPassword(data.password);
      const user: User = {
        email: data.email,
        name: data.name,
        studentPhone: data.studentPhone,
        parentPhone: data.parentPhone,
        specialization: data.specialization,
        governorate: data.governorate,
        year: data.YearCombo,
        passwordHash: passwordHash
      };

      insertUser(user);
    } 
    catch (err) {
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

    try {
      const data = req.body;
      validation.loginSchema.parse(data);

      const existingUser: User | null = await getUserByEmail(data.email);
      if (!existingUser) {
        res.status(404).json({
          'message': 'User does not exist'
        });
        return;
      }

      if (await verifyPassword(existingUser.passwordHash, data.password) == false) {
        res.status(400).json({
          'message': 'Incorrect password'
        });
        return;
      }
    }
    catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          'message': 'Invalid login data'
        });
        return;
      }
      else {
        console.log(err);
        res.status(500).send();
        return;
      }
    }

    res.status(200).send();
  })

export default app;
