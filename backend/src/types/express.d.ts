import * as express from 'express';
import { User } from './backend/src/core/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Declare the user property with the User type, optional because it might not always be available
    }
  }
}