import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as controller from './video.controller.ts';

const router = express.Router();

router.route('/:videoId').get(controller.getVideo);

export default router;
