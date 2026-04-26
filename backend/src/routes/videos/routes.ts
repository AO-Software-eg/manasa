import express, { type Request, type Response } from 'express';
import * as auth from '../../auth.ts';

const router = express.Router();

router.route('/:videoId').get(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { videoId } = req.params;

  try {
    const axios = (await import('axios')).default;

    const payload = auth.verifyToken(req.cookies.user_token);
    if (!payload.id) {
      throw new Error('Expected id in token.');
    }

    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        ttl: 300,

        annotate: JSON.stringify([
          {
            type: 'rtext',
            text: `ID: ${payload.id}`,
            interval: 5000,
            alpha: 0.6,
            color: '#FFFFFF',
            size: 18,
            xpos: 50,
            ypos: 50,
          },
        ]),
      },
      {
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.json({
      otp: response.data.otp,
      playbackInfo: response.data.playbackInfo,
    });
  } catch (err: any) {
    console.log('ERROR:', JSON.stringify(err.response?.data, null, 2));

    return res.status(500).json(err.response?.data);
  }
});

export default router;
