import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userAuth from '../models/user.data.model.js';

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNumber, role } = req.body;

    const existingUser = await userAuth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'failed', message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userAuth({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ status: 'success', message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Unable to register user' });
  }
});

userRouter.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await userAuth.findOne({ email });
      if (!user) {
        return res.status(400).json({ status: 'failed', message: 'Invalid credentials' });
      }

      console.log("user exist");
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ status: 'failed', message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
      res.status(200).json({ status: 'success', message: 'Login successful', token });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});  

export default userRouter;
