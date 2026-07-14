import express, { type Request, type Response } from 'express';

import * as controller from './user.controller.ts';

const router = express.Router();

router.route('/me').get(controller.getMe);

export default router;
