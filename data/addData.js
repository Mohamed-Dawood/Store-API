import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

import Product from '../models/productModel.js';
import { connectDB } from '../db/connect.js';

const products = JSON.parse(fs.readFileSync(`data/data.json`, 'utf8'));

const DB = process.env.DB_URL.replace('<db_password>', process.env.DB_PASSWORD);

const addData = async () => {
  try {
    await connectDB(DB);
    console.log('DB connected successfully...');
    await Product.deleteMany();
    console.log('Data Deleted successfully...');
    await Product.create(products);
    console.log('Data Added successfully...');
  } catch (error) {
    console.log(error);
  }
};

addData();
