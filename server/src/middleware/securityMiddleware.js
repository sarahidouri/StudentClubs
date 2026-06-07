import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';


export const morganMiddleware = morgan('combined');


export const helmetMiddleware = helmet();


export const compressionMiddleware = compression();


export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});
