let api_url: string | undefined;

if (process.env.NODE_ENV == 'development') {
  api_url = process.env.NEXT_PUBLIC_LOCAL_API_URL;
} else if (process.env.NODE_ENV == 'production') {
  api_url = process.env.NEXT_PUBLIC_API_URL;
}

if (!api_url) {
  throw new Error('Backend API url not found in environment variables.');
}

export const API_URL: string = api_url;
