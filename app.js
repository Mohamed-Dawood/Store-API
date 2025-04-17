import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import { connectDB } from './db/connect.js';
import productRouter from './routes/productRoute.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'Production') {
  app.use(morgan('dev'));
}
// Routes
app.use('/api/v1/products', productRouter);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8001;

const DB = process.env.DB_URL.replace('<db_password>', process.env.DB_PASSWORD);

const start = () => {
  app.listen(port, async () => {
    try {
      await connectDB(DB);
      console.log(`App is listening on port ${port}...`);
    } catch (error) {
      console.log("Server Couldn't Start : ", error);
      process.exit(1);
    }
  });
};
start();
