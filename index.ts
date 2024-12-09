import 'reflect-metadata'; // Required for routing-controllers
import express from 'express';
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import { TodoController } from './backend/src/controllers/todo.controller';
import { AuthController } from './backend/src/controllers/auth.controller';
import { LoggingMiddleware, SameOriginMiddleware } from './backend/src/middlewares/logging.middleware';
import { ErrorHandlerMiddleware } from './backend/src/middlewares/error.middleware';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import next from 'next';
import { AuthMiddleware } from './backend/src/middlewares/auth.middleware';

const app = express();
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: './frontend' }); // Serve the Next.js frontend
const handle = nextApp.getRequestHandler();

app.use(express.json());

useExpressServer(app, {
  controllers: [TodoController, AuthController], // Register your controllers here
  middlewares: [LoggingMiddleware, SameOriginMiddleware, ErrorHandlerMiddleware],
  validation: true,
  currentUserChecker: async (action) => {
    const req = action.request;
    return req.user; // Return the user data attached by the auth middleware
  },
});

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
});

// Serve Swagger docs
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(spec));

// Prepare Next.js
nextApp.prepare().then(() => {
  // Handle Next.js frontend
  app.all('*', (req, res) => handle(req, res));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api/v1/docs`);
  });
});
