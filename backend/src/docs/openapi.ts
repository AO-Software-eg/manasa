import { coursesPaths } from './paths/courses.ts';
import { lecturesPaths } from './paths/lectures.ts';
import { examsPaths } from './paths/exams.ts';
import { usersPaths } from './paths/user.ts';
import { videosPaths } from './paths/videos.ts';
import * as schemas from './schemas/index.ts'


export const openApiDocument = {
  openapi: '3.1.0',

  info: {
    title: 'Alsultan API',
    version: '1.0.0',
    description: 'Backend API for Alsultan E-learning Platform',
  },

  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],

  paths: {
    ...coursesPaths,
    ...lecturesPaths,
    ...examsPaths,
    ...usersPaths,
    ...videosPaths,
  },

  components: {
    securitySchemes: {
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'user_token',
        description: 'JWT authentication cookie',
      },
    },
    schemas,
  },
};
