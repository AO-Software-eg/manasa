import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import jwt from 'jsonwebtoken';

import * as auth from '../../auth.ts';
import * as db from '../../database.ts';
import * as schema from '../../validation.ts';
import z, { ZodAny, ZodError } from 'zod';

const router = express.Router();

router
  .route('/paymob-callback')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    try {
      if (req.body?.type === 'TRANSACTION') {
        console.log(JSON.stringify(req.body, null, 2));

        const buyData = req.body?.obj?.payment_key_claims?.extra?.buyData;
        const billingData = req.body?.obj?.payment_key_claims?.billing_data;

        console.log(
          `buydata: ${JSON.stringify(buyData, null, 2)}\nbillingdata: ${JSON.stringify(billingData, null, 2)}`,
        );

        if (!buyData || !billingData) {
          return res
            .status(400)
            .json({ details: 'Invalid request body format' });
        }

        console.log('valid datas\n');

        let user = {} as db.SelectUser;
        try {
          user = await db.getUserByEmail(billingData.email);
          console.log('valid user');
        } catch (err: any) {
          console.log('invalid user');
          if (err instanceof db.RowNotFoundError) {
            return res.status(404).json({
              error: 'Not Found',
              message: `User not found, invalid user token?`,
              details: err,
            });
          } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
              error: 'Unauthorized Request',
              message: 'User token error, possibly not logged in?',
              details: err,
            });
          }
        }

        if (schema.buyItemSchema.safeParse(buyData).success) {
          console.log('buy data');
          if (buyData.itemType == 'course') {
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
        } else if (schema.walletDepositSchema.safeParse(buyData).success) {
          console.log('deposit');
          await db.addToWalletBalance(user.id, buyData.amount);
        } else {
          console.log('No schemasss');
          return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid request data',
            details: 'buyData does not fit any of the supported schemas',
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
      const jwtPayload = auth.verifyToken(req.cookies.user_token);
      const user: db.SelectUser = await db.getUserById(jwtPayload.id);

      const billDataSchema = z.object({
        amount: z.number().positive(),
        phoneNumber: z
          .string()
          .regex(
            schema.EGYPT_MOBILE_REGEX,
            'Invalid egyptian mobile phone number',
          ),
        redirectionUrl: z.string(),
        itemData: z.any(),
      });

      type billDataType = z.infer<typeof billDataSchema>;

      let billData = {} as billDataType;

      if (schema.buyItemSchema.safeParse(req.body).success) {
        const buyData: schema.buyItemData = req.body;

        let price;
        if (buyData.itemType == 'course') {
          const course: db.SelectCourse = await db.getCourseById(
            buyData.itemId,
          );

          if (await db.isUserEnrolled(user.id, course.id)) {
            return res.status(409).json({
              error: 'Conflict',
              message: `The item with type '${buyData.itemType}' and id ${buyData.itemId} is already owned by the user.`,
            });
          }

          billData.itemData = course;
          billData.amount = course.price;
          billData.redirectionUrl = `${process.env.FRONTEND_LOCAL_URL}/payment/result?courseId=${buyData.itemId}`;
          billData.phoneNumber = buyData.phoneNumber;
        } else {
          return res.status(501).json({
            error: 'Not Implemented',
            message: `The item type '${buyData.itemType}' is valid, but purchasing it is not yet supported.`,
          });
        }
        billData.itemData.buyData = buyData;
      } else if (schema.walletDepositSchema.safeParse(req.body).success) {
        const depositData: schema.walletDepositData = req.body;
        billData.itemData = {};
        billData.amount = depositData.amount;
        billData.phoneNumber = depositData.phoneNumber;
        billData.redirectionUrl = `${process.env.FRONTEND_LOCAL_URL}`;
      } else {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid request data',
          details: 'Request body does not fit any of the supported schemas',
        });
      }

      try {
        billDataSchema.parse(billData);
      } catch (err: any) {
        return res.status(500).json({
          error: 'Internal error',
          message: '',
          details: err,
        });
      }

      const payment: db.SelectPaymentTransaction = await db.createPayment();

      const nameParts = user.name.trim().split(/\s+/);

      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'NA'; // maybe empty if user has only one name

      console.log(billData);

      const body: BodyInit = JSON.stringify({
        amount: billData.amount * 100,
        currency: 'EGP',
        payment_methods: [5753956],
        billing_data: {
          first_name: firstName,
          last_name: lastName,
          email: user.email,
          phone_number: billData.phoneNumber,

          apartment: 'NA',
          street: 'NA',
          building: 'NA',
          city: 'NA',
          country: 'EGY',
          floor: 'NA',
          state: 'NA',
        },
        extras: {
          itemData: billData.itemData,
          buyData: req.body,
        },
        special_reference: `${payment.id}-${payment.createdAt}`,
        expiration: 3600,
        notification_url: `${process.env.NGROK_BASE_URL}/payment/paymob-callback`,
        redirection_url: billData.redirectionUrl,
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
