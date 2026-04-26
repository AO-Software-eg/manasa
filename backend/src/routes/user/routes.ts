import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';
import * as validation from '../../validation.ts';
import * as auth from '../../auth.ts';
import cookieParser from 'cookie-parser';
import z, { ZodError } from 'zod';
import bodyParser from 'body-parser';
import { hashPassword, verifyPassword } from '../../hash.ts';

const router = express.Router();

router
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
        id: '', // Doesn't matter, database creates the id
        email: data.email,
        name: data.name,
        studentPhone: data.studentPhone,
        parentPhone: data.parentPhone,
        specialization: data.specialization,
        governorate: data.governorate,
        year: data.YearCombo,
        passwordHash: passwordHash,
      };

      await db.insertUser(user);
      res.status(200).send();
    } catch (err: any) {
      console.log(err);
      if (err instanceof ZodError) {
        res.status(400).send();
      } else {
        res.status(500).send();
      }
    }
  });

router
  .route('/login')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      res.status(415).send();
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

      const token = auth.signToken({
        id: user.id,
        name: user.name,
        email: user.email,
        year: user.year,
        specialization: user.specialization,
        studentphone: user.studentPhone,
        governorate: user.governorate,

      });

      res.cookie('user_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV == 'production',
      });
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

router.route('/logout').post(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
     res.status(401).json({ message: 'No login token found' });
  }

  res.cookie('user_token', '', {
    expires: new Date(0),
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

router.route('/me').get(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
      res.status(401).send(); // end the request , return was not added
  }

  try {
    const payload = auth.verifyToken(req.cookies.user_token);
    if (!payload.id) {
      throw new Error('Expected id in token.');
    }
    if (!payload.name) {
      throw new Error('Expected name in token.');
    }
    if (!payload.email) {
      throw new Error('Expected email in token.');
    }



    const data = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      year: payload.year,
      specialization: payload.specialization,
      studentPhone: payload.studentphone,
      governorate: payload.governorate,
    };

    res.status(200).json(data);
  } catch (err: any) {
     res.status(401).send();
  }
});

export default router;
