import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as controller from './auth.controller.ts';

const router = express.Router();

router.route('/signup').post(bodyParser.json(), controller.signup);
router.route('/login').post(bodyParser.json(), controller.login);
router.route('/logout').post(bodyParser.json(), controller.logout);

export default router;
