// src/routes/adminRoutes.js
import express from 'express';
import {
  addStore,
  addUser,
  getDashboardStats,
  listStores,
  listUsers,
  getUserDetails,
  getStoreOwners,
} from '../controllers/adminController.js';

import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const adminRoutes = express.Router();

adminRoutes.use(authenticateToken, authorizeRoles('SYSTEM_ADMINISTRATOR'));

adminRoutes.post('/stores', addStore);
adminRoutes.post('/users', addUser);
adminRoutes.get('/dashboard', getDashboardStats);
adminRoutes.get('/stores', listStores);
adminRoutes.get('/users', listUsers);
adminRoutes.get('/users/:id', getUserDetails);
adminRoutes.get('/store-owners', getStoreOwners); 


export default adminRoutes;
