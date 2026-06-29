import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import jwt from 'jsonwebtoken';

import * as auth from '../../auth.ts';
import * as db from '../../database.ts';
import * as schema from '../../validation.ts';
import { ZodAny, ZodError } from 'zod';

const router = express.Router();

router
  .route('/paymob-callback')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    console.log(JSON.stringify(req.body, null, 2));
    try {
      if (req.body?.type === 'TRANSACTION') {
        const itemData = req.body?.obj?.payment_key_claims?.extra?.itemData;
        const buyData = itemData?.buyData;
        const billingData = req.body?.obj?.payment_key_claims?.billing_data;

        if (!itemData || !buyData || !billingData) {
          return res
            .status(500)
            .json({ details: 'Invalid request body format' });
        }

        if (buyData.itemType == 'course') {
          const user: db.SelectUser = await db.getUserByEmail(
            billingData.email,
          );

          const courseEnrollment: db.InsertCourseEnrollment = {
            studentId: user.id,
            courseId: buyData.itemId,
          };

          await db.addCourseEnrollment(courseEnrollment);
        } else {
          return res.status(501).json({
            error: 'Not Implemented',
            message: `The item type '${buyData.itemType}' is valid, but purchasing it is not yet supported.`,
          });
        }

        return res.status(200).send();
      } else {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid request data',
          details: 'expected type: TRANSACTION',
        });
      }
    } catch (err: any) {
      console.log(err);

      if (err instanceof db.RowNotFoundError) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid request data',
          details: err.message,
        });
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({
          error: 'Unauthorized Request',
          message: 'User token error, possibly not logged in?',
          details: err,
        });
      }

      return res.status(500).json({ details: err });
    }
  });

router
  .route('/buy-item')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    try {
      schema.buyItemSchema.parse(req.body);
      const buyData: schema.buyItemData = req.body;

      let price;
      let itemData: any;
      if (buyData.itemType == 'course') {
        const course: db.SelectCourse = await db.getCourseById(buyData.itemId);
        itemData = course;
        price = course.price;
      } else {
        return res.status(501).json({
          error: 'Not Implemented',
          message: `The item type '${buyData.itemType}' is valid, but purchasing it is not yet supported.`,
        });
      }
      itemData.buyData = buyData;

      const payment: db.SelectPaymentTransaction = await db.createPayment();

      const jwtPayload = auth.verifyToken(req.cookies.user_token);
      const user: db.SelectUser = await db.getUserByEmail(jwtPayload.email);
      const nameParts = user.name.trim().split(/\s+/);

      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const body: BodyInit = JSON.stringify({
        amount: price * 100,
        currency: 'EGP',
        payment_methods: [5753956],
        billing_data: {
          first_name: firstName,
          last_name: lastName,
          email: user.email,
          phone_number: buyData.phoneNumber,

          apartment: 'NA',
          street: 'NA',
          building: 'NA',
          city: 'NA',
          country: 'EGY',
          floor: 'NA',
          state: 'NA',
        },
        extras: {
          itemData,
        },
        special_reference: `${payment.id}-${payment.createdAt}`,
        expiration: 3600,
        notification_url: `${process.env.NGROK_BASE_URL}/payment/paymob-callback`,
        redirection_url: `${process.env.FRONTEND_LOCAL_URL}/payment/result?courseId=${buyData.itemId}`,
      });

      const headers: HeadersInit = new Headers();
      headers.append('Authorization', `Token ${process.env.PAYMOB_SECRET_KEY}`);
      headers.append('Content-Type', 'application/json');

      const options: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow',
      };

      const intentionRes = await fetch(
        'https://accept.paymob.com/v1/intention/',
        options,
      );

      if (!intentionRes.ok) {
        return res.status(intentionRes.status).json({
          error: 'Paymob API Error',
          details: intentionRes,
        });
      }

      return res.status(200).send(await intentionRes.json());
    } catch (err: any) {
      console.log(err);

      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid request data',
          details: err,
        });
      } else if (err instanceof db.RowNotFoundError) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid request data',
          details: err.message,
        });
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({
          error: 'Unauthorized Request',
          message: 'User token error, possibly not logged in?',
          details: err,
        });
      }

      return res.status(500).json({ details: err });
    }
  });

export default router;
