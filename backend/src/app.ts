import express, { type Request, type Response } from 'express';
import db, {getImageLink} from './database.ts'

const app = express();

// Routes
app.route('/images/:imageName').get(async (req: Request<{imageName: string}>, res: Response) => {
  try {
    const imageName = req.params.imageName;
    const result = await getImageLink(imageName);
    if (result) {
      res.json({ 
        message: "Found image",
        imageUrl: result
      });
    }
    else {
      res.status(404).json({
        message: "Image not found",
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

export default app;