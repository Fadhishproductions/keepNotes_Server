import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import { generateRefreshToken,generateAccessToken } from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// --- Register user ---
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  generateRefreshToken(res, user._id);
  const accessToken = generateAccessToken(user._id);
  res.json({  token: accessToken, user: { id: user._id, name: user.name } });
};


// --- Login user ---
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  generateRefreshToken(res, user._id);
  const accessToken = generateAccessToken(user._id);
  res.json({  token: accessToken, user: { id: user._id, name: user.name } });
};



// --- Google OAuth login ---
export const googleLogin = async (req, res) => {
  const { token } = req.body;
  
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { name, email, sub: googleId } = ticket.getPayload();
    
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    }
    
    generateRefreshToken(res, user._id);
    const accessToken = generateAccessToken(user._id);
  res.json({  token: accessToken, user: { id: user._id, name: user.name } });
  } catch (error) {
    console.error('Google login failed:', error.message);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    res.json({ token: accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('refreshToken', {
    path: '/api/auth/refresh-token',
  });
  res.json({ message: 'Logged out successfully' });
};
