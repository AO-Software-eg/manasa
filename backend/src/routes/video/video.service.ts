import * as db from '../../database.ts';
import * as util from '../util.ts';

export async function getVideo(videoId: string, userId: number) {
  const axios = (await import('axios')).default;

  const response = await axios.post(
    `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
    {
      ttl: 300,

      annotate: JSON.stringify([
        {
          type: 'rtext',
          text: `ID: ${userId}`,
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

  return {
    otp: response.data.top,
    playbackInfo: response.data.playbackInfo,
  };
}
