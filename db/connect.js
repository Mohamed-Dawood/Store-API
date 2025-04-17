import mongoose from 'mongoose';

export const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('DB Connected Successfully...');
  } catch (error) {
    console.log('Error In Connecting DB : ', error);
    throw new Error('DB Connection Failed');
  }
};
