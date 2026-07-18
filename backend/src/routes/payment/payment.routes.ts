import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as controller from './payment.controller.ts';

const router = express.Router();

router.route('/buy-item').post(bodyParser.json(), controller.buyItem);
router
  .route('/paymob-callback')
  .post(bodyParser.json(), controller.paymobCallback);

export default router;
