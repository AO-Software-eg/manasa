import express, { type Request, type Response } from 'express';

const app = express();

// Routes
app.route('/').get((req: Request, res: Response) => {
  res.send('Hello Backend!');
});

export default app;