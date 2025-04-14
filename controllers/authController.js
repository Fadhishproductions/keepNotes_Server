import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import { generateRefreshToken,generateAccessToken } from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import AppError from '../utils/AppError.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// --- Register user ---
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  
  if (!name?.trim() || !email?.trim() || !password) {
    throw new AppError('All fields are required', 400);
  }
  
  const userExists = await User.findOne({ email });
  if (userExists) throw new AppError('User already exists', 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  generateRefreshToken(res, user._id);
  const accessToken = generateAccessToken(user._id);
  res.json({  token: accessToken, user: { id: user._id, name: user.name } });
});


// --- Login user ---
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email?.trim() || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  generateRefreshToken(res, user._id);
  const accessToken = generateAccessToken(user._id);
  res.json({  token: accessToken, user: { id: user._id, name: user.name } });
});



// --- Google OAuth login ---
export const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new AppError('Google token missing', 400);
  
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { name, email, sub: googleId } = ticket.getPayload();
    if (!email) throw new AppError('Google authentication failed', 401);

    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    }
    
    generateRefreshToken(res, user._id);
    const accessToken = generateAccessToken(user._id);
  res.json({  token: accessToken, user: { id: user._id, name: user.name } });
  
});

export const refreshToken = asyncHandler((req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError('No refresh token', 401);

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const accessToken = generateAccessToken(decoded.id);

  res.json({ token: accessToken });
});


// --- Logout ---
export const logoutUser = asyncHandler((req, res) => {
  res.clearCookie('refreshToken', {
    path: '/api/auth/refresh-token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.json({ message: 'Logged out successfully' });
});

