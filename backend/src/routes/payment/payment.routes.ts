import express, { type Request, type Response, type Router } from 'express';

import * as controller from './payment.controller.ts';

const router: Router = express.Router();

router.route('/buy-item').post(express.json(), controller.buyItem);
router
  .route('/paymob-callback')
  .post(express.json(), controller.paymobCallback);

router
  .route('/buy-item-wallet')
  .post(express.json(), controller.buyItemWithWallet);
export default router;
