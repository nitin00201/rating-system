// src/routes/userRoutes.js
import express from 'express';
import {
  updatePassword,
  getAllStores,
  submitRating,
  updateRating,
  deleteRatingByUserAndStore,
} from '../controllers/userController.js';

import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const userRoutes = express.Router();

userRoutes.use(authenticateToken, authorizeRoles('NORMAL_USER'));

userRoutes.patch('/update-password', updatePassword);
userRoutes.get('/stores', getAllStores);
userRoutes.post('/ratings', submitRating);
userRoutes.put('/ratings/:id', updateRating);
userRoutes.delete('/ratings/:storeId', authenticateToken, deleteRatingByUserAndStore);


export default userRoutes;
