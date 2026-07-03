
export const usersPaths= {
  '/signup': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      operationId: 'signup',

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SignupRequest',
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'User created',
        },
        '400': {
          description: 'Invalid data or user already exists',
        },
      },
    },
  },

  '/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login',

      operationId: 'login',

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'Login successful',
        },
        '400': {
          description: 'Invalid credentials',
        },
        '404': {
          description: 'User not found',
        },
      },
    },
  },

  '/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout',

      security: [{ CookieAuth: [] }],

      responses: {
        '200': {
          description: 'Logged out',
        },
        '401': {
          description: 'Not logged in',
        },
      },
    },
  },

  '/me': {
    get: {
      tags: ['Users'],
      summary: 'Get current user',

      security: [{ CookieAuth: [] }],

      responses: {
        '200': {
          description: 'Current user',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
        },
      },
    },
  },

  '/users/enroll': {
    post: {
      tags: ['Enrollments'],
      summary: 'Enroll a student in a course',

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/EnrollRequest',
            },
          },
        },
      },

      responses: {
        '201': {
          description: 'Enrollment created',
        },
      },
    },
  },

  '/users/{userId}/enrollments': {
    get: {
      tags: ['Enrollments'],
      summary: 'Get user enrollments',

      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ] ,

      responses: {
        '200': {
          description: 'Enrollment list',
        },
      },
    },
  },

  '/users/{userId}/progress/{courseId}': {
    get: {
      tags: ['Progress'],
      summary: 'Get course progress',

      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
        {
          name: 'courseId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ] ,

      responses: {
        '200': {
          description: 'Course progress',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProgressResponse',
              },
            },
          },
        },
      },
    },
  },

  '/users/{userId}/grades': {
    get: {
      tags: ['Grades'],
      summary: 'Get all exam submissions',

      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ] ,

      responses: {
        '200': {
          description: 'Exam submissions',
        },
      },
    },
  },

  '/users/{userId}/grades/{examId}': {
    get: {
      tags: ['Grades'],
      summary: 'Get submissions for a specific exam',

      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
        {
          name: 'examId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ] ,

      responses: {
        '200': {
          description: 'Exam submissions',
        },
        '404': {
          description: 'User or exam not found',
        },
      },
    },
  },
}  ;