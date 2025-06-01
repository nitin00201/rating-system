import express from 'express';
import { getUserDetails, login, logout, register } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { updatePassword } from '../controllers/userController.js';

const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.post('/register', register);
authRoutes.get('/profile',authenticateToken,getUserDetails)
authRoutes.patch('/update-password',authenticateToken, updatePassword);




export default authRoutes;
