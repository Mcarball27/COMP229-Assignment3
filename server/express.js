
import express from 'express';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import contactRoutes from './routes/contact.routes.js';
import projectRoutes from './routes/project.routes.js';
import qualificationRoutes from './routes/qualification.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// API routes
app.use('/', contactRoutes);
app.use('/', projectRoutes);
app.use('/', qualificationRoutes);
app.use('/', userRoutes);
app.use('/', authRoutes);

// Error handling
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: err.name + ': ' + err.message
    });
  }

  console.error(err);

  return res.status(500).json({
    error: 'Internal server error'
  });
});

export default app;
