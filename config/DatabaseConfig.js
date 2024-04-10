import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectToDatabase(){
  const url = process.env.URL;
  await mongoose.connect(url, {
    useNewUrlParser: true,
  });
  console.log('Connected To MongoDB Database');
}
