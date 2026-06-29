import { apiReference } from '@scalar/express-api-reference';
import { openApiDocument } from './openapi.ts';

export const scalarDocs = apiReference({
  content: openApiDocument,

  theme: 'kepler',

  pageTitle: 'Alsultan API',

  authentication: {
    preferredSecurityScheme: 'CookieAuth',
  },

  hideDownloadButton: false,

  searchHotKey: 'k',
});