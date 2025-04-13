import express from 'express';
import { googleLogin, loginUser, logoutUser, refreshToken, registerUser } from '../controllers/authController.js';
 
const router = express.Router();

// 👤 Normal auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🔁 Refresh token
router.get('/refresh-token', refreshToken);

// 🚪 Logout
router.post('/logout', logoutUser);

// 🔐 Google OAuth
router.post('/google', googleLogin);

export default router;
