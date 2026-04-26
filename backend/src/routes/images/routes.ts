import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';

const router = express.Router();

router
  .route('/:imageName')
  .get(async (req: Request<{ imageName: string }>, res: Response) => {
    try {
      const imageName = req.params.imageName;
      const result = await db.getImageLink(imageName);
      if (result) {
        res.json({
          message: 'Found image',
          imageUrl: result,
        });
      } else {
        res.status(404).json({
          message: 'Image not found',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  });

export default router;
