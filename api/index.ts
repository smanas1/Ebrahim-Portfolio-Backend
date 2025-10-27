import { Request, Response } from 'express';
import app from '../src/app';

// Type the request and response for Vercel
type VercelRequest = any;
type VercelResponse = any;

export default (req: VercelRequest, res: VercelResponse) => {
  // Vercel expects a single handler, so we pass the request to our Express app
  app(req, res);
};