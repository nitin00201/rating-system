import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

// Update password (reuse same logic as Normal User)
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

// Dashboard: list users who rated this store + average rating
export const getDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    // Find the store owned by this user
    const store = await prisma.store.findUnique({
      where: { ownerId: ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
        },
      },
    });

    if (!store) return res.status(404).json({ message: 'Store not found' });

    const ratings = store.ratings;

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((acc, r) => acc + r.ratingValue, 0) / ratings.length
        : 0;

    // List users who submitted ratings (unique by user id)
    const usersRated = [];

    const seenUserIds = new Set();
    for (const rating of ratings) {
      const u = rating.user;
      if (!seenUserIds.has(u.id)) {
        usersRated.push(u);
        seenUserIds.add(u.id);
      }
    }

    res.json({
      averageRating: avgRating.toFixed(2),
      usersRated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStoresWithRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    const stores = await prisma.store.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!stores || stores.length === 0) {
      return res.status(404).json({ message: "No stores found for this user" });
    }

    res.status(200).json(stores);
  } catch (error) {
    console.error("Error fetching stores with ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
