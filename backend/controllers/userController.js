import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export const getUserDetails = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          createdAt: true
        }
      });
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

export const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Old password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllStores = async (req, res) => {
    const { name, address } = req.query;
    const userId = req.user.id;
  
    try {
      const stores = await prisma.store.findMany({
        where: {
          name: name ? { contains: name, mode: 'insensitive' } : undefined,
          address: address ? { contains: address, mode: 'insensitive' } : undefined,
        },
        include: {
          ratings: true,
        },
      });
  
      const results = await Promise.all(
        stores.map(async (store) => {
          const avgRating =
            store.ratings.length > 0
              ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
              : 0;
  
          const userRating = store.ratings.find((r) => r.userId === userId);
  
          return {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            averageRating: avgRating.toFixed(2),
            userRating: userRating?.rating || null,
          };
        })
      );
  
      res.status(200).json(results);
    } catch (err) {
      console.error(" Error in getAllStores:", err);
      res.status(500).json({ error: err.message });
    }
  };
  

// export const getAllStores = async (req, res) => {
//     const { name, address, sortBy = 'name', order = 'asc', limit = 10, page = 1 } = req.query;
//     const userId = req.user.id;
  
//     const skip = (Number(page) - 1) * Number(limit);
  
//     try {
//       const stores = await prisma.store.findMany({
//         where: {
//           name: name ? { contains: name, mode: 'insensitive' } : undefined,
//           address: address ? { contains: address, mode: 'insensitive' } : undefined,
//         },
//         orderBy: {
//           [sortBy]: order === 'desc' ? 'desc' : 'asc',
//         },
//         skip: skip,
//         take: Number(limit),
//         include: {
//           ratings: true,
//         },
//       });
  
//       const totalStores = await prisma.store.count();
  
//       const results = await Promise.all(
//         stores.map(async (store) => {
//           const avgRating =
//             store.ratings.length > 0
//               ? store.ratings.reduce((sum, r) => sum + r.ratingValue, 0) / store.ratings.length
//               : 0;
  
//           const userRating = store.ratings.find((r) => r.userId === userId);
  
//           return {
//             id: store.id,
//             name: store.name,
//             address: store.address,
//             overallRating: avgRating.toFixed(2),
//             userRating: userRating?.ratingValue || null,
//           };
//         })
//       );
  
//       res.json({
//         total: totalStores,
//         page: Number(page),
//         limit: Number(limit),
//         data: results,
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  

// ⭐ Submit a new rating
export const submitRating = async (req, res) => {
    const userId = req.user.id;
    const { storeId, ratingValue } = req.body;
  
    console.log(" Incoming request body:", req.body);
    console.log(" Extracted userId from token:", userId);
    console.log(" Extracted storeId:", storeId);
    console.log(" Extracted ratingValue:", ratingValue);
  
    // Validate rating range
    if (ratingValue < 1 || ratingValue > 5) {
      console.log(" Invalid rating value:", ratingValue);
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  
    try {
      // Check for existing rating
      const existing = await prisma.rating.findFirst({
        where: {
          userId,
          storeId,
        },
      });
  
      console.log(" Existing rating check result:", existing);
  
      if (existing) {
        console.log(" User has already rated this store.");
        return res
          .status(400)
          .json({ message: 'Rating already submitted. Use update instead.' });
      }
  
      // Create new rating
      const rating = await prisma.rating.create({
        data: {
          userId,
          storeId,
          rating: ratingValue, 
        },
      });
  
      console.log("Rating successfully created:", rating);
      res.status(201).json(rating);
    } catch (err) {
      console.error(" Error during rating submission:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  

  export const updateRating = async (req, res) => {
    const userId = req.user.id;
    const { storeId, ratingValue } = req.body;
  
    console.log("Incoming request to update rating");
    console.log("userId:", userId);
    console.log("storeId:", storeId);
    console.log("new ratingValue:", ratingValue);
  
    if (ratingValue < 1 || ratingValue > 5) {
      console.log(" Invalid rating value:", ratingValue);
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  
    try {
      const existing = await prisma.rating.findFirst({
        where: {
          userId,
          storeId,
        },
      });
  
      if (!existing) {
        console.log("No existing rating found for this user and store.");
        return res.status(404).json({ message: 'Rating not found. Submit a rating first.' });
      }
  
      const updatedRating = await prisma.rating.update({
        where: {
          id: existing.id,
        },
        data: {
          rating: ratingValue,
        },
      });
  
      console.log("Rating updated successfully:", updatedRating);
      res.status(200).json(updatedRating);
    } catch (err) {
      console.error(" Error updating rating:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  export const deleteRatingByUserAndStore = async (req, res) => {
    const userId = req.user?.id; // You must have user auth middleware setting this
    const storeId = parseInt(req.params.storeId, 10);
  
    if (!userId || isNaN(storeId)) {
      return res.status(400).json({ error: 'Invalid user or store ID' });
    }
  
    try {
      const existing = await prisma.rating.findUnique({
        where: {
          userId_storeId: {
            userId,
            storeId,
          },
        },
      });
  
      if (!existing) {
        return res.status(404).json({ error: 'Rating not found for this user and store' });
      }
  
      await prisma.rating.delete({
        where: {
          userId_storeId: {
            userId,
            storeId,
          },
        },
      });
  
      res.json({ message: 'Rating deleted successfully' });
    } catch (err) {
      console.error('Error deleting rating:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  