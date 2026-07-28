import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as controller from './auth.controller.ts';

const router = express.Router();

router.route('/signup').post(bodyParser.json(), controller.signup);
router.route('/login').post(bodyParser.json(), controller.login);
router.route('/logout').post(bodyParser.json(), controller.logout);
router.route('/refresh').post(bodyParser.json(), controller.refresh);

router.route('/check-phone').post(bodyParser.json(), controller.checkPhone);

router
  .route('/reset-password')
  .post(bodyParser.json(), controller.resetPassword);
router
  .route('/reset-password/token')
  .post(bodyParser.json(), controller.resetPasswordToken);

router.route('/akedly/send').post(bodyParser.json(), controller.akedlySend);
router.route('/akedly/challenge').get(controller.akedlyChallenge);
router.route('/akedly/verify').post(bodyParser.json(), controller.akedlyVerify);

export default router;
