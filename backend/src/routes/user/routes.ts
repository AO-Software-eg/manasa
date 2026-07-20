import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';
import * as validation from '../../validation.ts';
import * as auth from '../../auth.ts';
import cookieParser from 'cookie-parser';
import z, { date, ZodError } from 'zod';
import bodyParser from 'body-parser';
import { hashPassword, verifyPassword } from '../../hash.ts';

const router = express.Router();

router
  .route('/signup')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      return res.status(415).send();
    }

    try {
      const data = req.body;
      validation.signupSchema.parse(data);

      const userExists: boolean = await db.isUserFound(data.email);
      if (userExists) {
        return res.status(400).json({
          message: 'المستخدم موجود بالفعل',
        });
      }

      const studentPhoneExists: boolean = await db.isStudentPhoneFound(data.studentPhone);
      if (studentPhoneExists) {
        return res.status(400).json({
          message: 'رقم الهاتف الطالب مستخدم بالفعل',
        });
      }

      const passwordHash = await hashPassword(data.password);
      const user: db.User = {
        id: 0,  // Doesn't matter, database creates the id
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
      return res.status(200).send();
    } catch (err: any) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.status(400).send();
      } else {
        return res.status(500).json({
          message: err instanceof Error ? err.message : 'حدث خطأ ما !',
        });
      }
    }
  });

router
  .route('/login')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      return res.status(415).send();
    }

    try {
      const data = req.body;
      validation.loginSchema.parse(data);

      const user: db.User = await db.getUserByIdentifier(data.identifier);

      if ((await verifyPassword(user.passwordHash, data.password)) == false) {
        return res.status(400).json({
          message: 'كلمة سر غير صحيحه',
        });
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
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'بيانات غير صحيحه',
        });
      } else if (err instanceof db.RowNotFoundError) {
        return res.status(404).json({
          message: 'المستخدم غير موجود',
        });
      } else {
        console.log(err);
        return res.status(500).json({
          message: err instanceof Error ? err.message : 'حدث خطأ ما !',
        });
      }
    }

    return res.status(200).send();
  });

router.route('/logout').post(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res.status(401).json({ message: 'لا يوجد حساب مسجل' });
  }

  res.cookie('user_token', '', {
    expires: new Date(0),
    path: '/',
  });

  return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
});

router.route('/me').get(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res.status(401).send(); // end the request , return was not added
  }

  try {
    const payload = auth.verifyToken(req.cookies.user_token);
    if (!payload.email) {
      return res.status(500).json({ message: 'Email not found in token' });
    }

    const user: db.User = await db.getUserByEmail(payload.email);
    if (user?.passwordHash) {
      user.passwordHash = '';
    }

    return res.status(200).json(user);
  } catch (err: any) {
    if (err instanceof db.RowNotFoundError) {
      res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    return res.status(500).send();
  }
});

router.route('/reset-password/token').post(bodyParser.json(), async (req: Request, res: Response) => {
  if (!req.is('application/json')) {
    return res.status(415).send();
  }

  try {
    const { phone } = req.body;
    console.log('Reset token request for phone:', phone);
    // getUserByPhone already normalizes the phone, so we're good
    const user = await db.getUserByPhone(phone);
    console.log('Found user:', user);

    const resetToken = auth.signToken(
      {
        id: user.id,
        purpose: "reset-password",
      },
      "10m"
    );
    console.log('Generated reset token:', resetToken);

    return res.status(200).json({ resetToken });
  } catch (err: any) {
    console.log('Reset token error:', err);
    if (err instanceof db.RowNotFoundError) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    return res.status(500).json({
      message: err instanceof Error ? err.message : 'حدث خطأ ما !',
    });
  }
});

router.route('/reset-password').post(bodyParser.json(), async (req: Request, res: Response) => {
  if (!req.is('application/json')) {
    return res.status(415).send();
  }

  try {
    const { resetToken, newPassword } = req.body;
    console.log('Received reset password request');
    console.log('resetToken:', resetToken);
    console.log('newPassword:', newPassword ? 'provided' : 'missing');

    const payload = auth.verifyToken(resetToken);
    console.log('Decoded payload:', payload);

    const user = await db.getUserByPhone(payload.phone);

    const newPasswordHash = await hashPassword(newPassword);

    await db.updateUserPassword(user.id, newPasswordHash);

    if (payload.purpose !== "reset-password") {
      return res.status(400).json({ message: 'Invalid token purpose' });

    }

    
    console.log('New password hash:', newPasswordHash);

    await db.updateUserPassword(payload.id as number, newPasswordHash);

    return res.status(200).send();
  } catch (err: any) {
    console.log('Reset password error:', err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : 'حدث خطأ ما !',
    });
  }
});

router.route('/check-phone').post(bodyParser.json(), async (req: Request, res: Response) => {
  if (!req.is('application/json')) {
    return res.status(415).send();
  }

  try {
    const { phone } = req.body;
    const exists = await db.isPhoneRegistered(phone);
    return res.status(200).json({ exists });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : 'حدث خطأ ما !',
    });
  }
});

export default router;
