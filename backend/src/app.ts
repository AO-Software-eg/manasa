import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';

import db, { getImageLink } from './database.ts';

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

// Routes
app
  .route('/images/:imageName')
  .get(async (req: Request<{ imageName: string }>, res: Response) => {
    try {
      const imageName = req.params.imageName;
      const result = await getImageLink(imageName);
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

app
  .route('/signup')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    //  await fs.writeFile("bodyDebug.txt", JSON.stringify(req.body));

    res.status(200).send();
  });

export default app;
