// src/routes/storeOwnerRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { updatePassword, getDashboard, getStoresWithRatings } from '../controllers/storeOwnerController.js';

const storeOwnerRoutes = express.Router();

storeOwnerRoutes.use(authenticateToken, authorizeRoles('STORE_OWNER'));

storeOwnerRoutes.patch('/update-password', updatePassword);

storeOwnerRoutes.get('/dashboard', getDashboard);
storeOwnerRoutes.get('/stores', authenticateToken, getStoresWithRatings);


export default storeOwnerRoutes;
