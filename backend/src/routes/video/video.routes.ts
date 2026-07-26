import express, { type Request, type Response, type Router } from 'express';

import * as controller from './video.controller.ts';

const router: Router = express.Router();

router.route('/:videoId').get(express.json(), controller.getVideo);

export default router;
