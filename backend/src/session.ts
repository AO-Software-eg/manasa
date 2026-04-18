import session from 'express-session';

if (!process.env.SESSION_KEY) {
  throw new Error('FATAL ERROR: SESSION_KEY is not defined in .env');
}

export const sessionObject = session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false, // only create the cookie once we modify the session
  cookie: {
    secure: process.env.NODE_ENV == 'production',
    httpOnly: true
  }
});

type UserSessionData = {
  id: number;
};

declare module 'express-session' {
  interface SessionData {
    user: UserSessionData;
  }
}
