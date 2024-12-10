import 'reflect-metadata'; // Required for routing-controllers
import express from 'express';
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import { TodoController } from './backend/src/controllers/todo.controller';
import { AuthController } from './backend/src/controllers/auth.controller';
import { LoggingMiddleware, SameOriginMiddleware } from './backend/src/middlewares/logging.middleware';
import { ErrorHandlerMiddleware } from './backend/src/middlewares/error.middleware';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import next from 'next';
import csurf from 'csurf';
import { config } from 'dotenv';

config();

const app = express();
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: './frontend' }); // Serve the Next.js frontend
const handle = nextApp.getRequestHandler();

app.use(express.json());

// Generate OpenAPI schema
const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, {}, {
  info: {
    title: 'Todo API',
    description: 'API documentation for the Todo app',
    version: '1.0.0',
  },
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  servers: [{ url: '/api/v1' }], // Base path for your API
  apis: ['./backend/src/controllers/*.ts', './backend/src/core/dtos/*.ts']
});

// Serve Swagger docs
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(spec));

useExpressServer(app, {
  controllers: [TodoController, AuthController], // Register your controllers here
  middlewares: [LoggingMiddleware, SameOriginMiddleware, ErrorHandlerMiddleware],
  validation: true,
  currentUserChecker: async (action) => {
    const req = action.request;
    return req.user; // Return the user data attached by the auth middleware
  },
});

// Middleware for parsing cookies
app.use(cookieParser());

// Set up CSRF protection
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Pass the CSRF token to frontend (e.g., in cookies or meta tags)
app.use((req, res, next) => {
  if (!res.headersSent) { // Ensure headers are not already sent
    res.cookie('XSRF-TOKEN', req.csrfToken());
  }
  next();
});

// Prepare Next.js
nextApp.prepare().then(() => {
  // Redirect the base URL to the login page
  app.get('/', (req, res) => {
    res.redirect('/login');
  });
  // Handle Next.js frontend
  app.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api/v1/docs`);
  });
});
