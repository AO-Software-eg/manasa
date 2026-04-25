import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';
import z, { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

import { hashPassword, verifyPassword } from './hash.ts';
import * as db from './database.ts';
import * as validation from './validation.ts';
import * as auth from './auth.ts';
import cookieParser from 'cookie-parser';

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
  if (!req.cookies.user_token) {
    res.status(401).send();
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
    };

    res.status(200).json(data);
  } catch (err: any) {
    res.status(401).send();
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

app.route('/course/:courseId').get(async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;

    if (typeof courseId !== 'string') {
      return res.status(401).json({ message: 'Invalid course ID paramater' });
    }
    if (/^\d+$/.test(courseId) === false) {
      return res.status(401).json({ message: 'Invalid course ID paramater' });
    }
    const course: db.Course | null = await db.getCourseById(Number(courseId));
    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    return res.status(200).json({ message: 'Found course', data: course });
  } catch (err: any) {
    console.log(err);
    res.status(500).send();
  }
});

app.route('/courses').get(async (req: Request, res: Response) => {
  try {
    const courses = await db.getAllCourses();
    return res
      .status(200)
      .json({ message: 'Courses retrieval successful', data: courses });
  } catch (err: any) {
    console.log(err);
    res.status(500).send();
  }
});


app.route('/test').get(async (req: Request, res: Response) => {
  try {    const axios = (await import('axios')).default;
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    return res.json(response.data);
  }
    catch (err: any) {
      console.log(err);
      res.status(500).send();
    }
});

app.route('/video/:videoId').get(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { videoId } = req.params;

  try {
    const axios = (await import('axios')).default;

    const payload = auth.verifyToken(req.cookies.user_token);
    if (!payload.id) {
      throw new Error('Expected id in token.');
    }

    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        ttl: 300,

        annotate: JSON.stringify([
          {
            type: 'rtext',
            text: `ID: ${payload.id}`,
            interval: 5000,
            alpha: 0.6,
            color: '#FFFFFF',
            size: 18,
            xpos: 50,
            ypos: 50,
          },
        ]),
      },
      {
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.json({
      otp: response.data.otp,
      playbackInfo: response.data.playbackInfo,
    });
  } catch (err: any) {
    console.log('ERROR:', JSON.stringify(err.response?.data, null, 2));

    return res.status(500).json(err.response?.data);
  }
});

export default app;
