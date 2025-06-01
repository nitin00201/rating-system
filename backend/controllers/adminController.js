// src/controllers/adminController.js
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;

  try {
    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
    });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listStores = async (req, res) => {
  const { name, email, address } = req.query;

  try {
    const stores = await prisma.store.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        email: email ? { contains: email, mode: 'insensitive' } : undefined,
        address: address ? { contains: address, mode: 'insensitive' } : undefined,
      },
      include: {
        ratings: {
          include: {
            user: true, // If you want to show user info in frontend later
          },
        },
        owner: true, // Optional: Include store owner info if needed
      },
    });

    const formattedStores = stores.map((store) => {
      const avgRating =
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerName: store.owner.name,
        averageRating: avgRating.toFixed(2),
        totalRatings: store.ratings.length,
      };
    });

    res.json(formattedStores);
  } catch (err) {
    console.error('Error listing stores:', err);
    res.status(500).json({ error: err.message });
  }
};


export const listUsers = async (req, res) => {
  const { name, email, address, role } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        email: email ? { contains: email, mode: 'insensitive' } : undefined,
        address: address ? { contains: address, mode: 'insensitive' } : undefined,
        role: role ? role : undefined,
      },
    });

    const filtered = users

    res.json(filtered.map(({ id, name, email, address, role }) => ({ id, name, email, address, role })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log("Requested user ID:", userId);

  if (isNaN(userId)) {
    console.error("Invalid user ID");
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    console.log("Fetching user from database...");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stores: {
          include: {
            ratings: true,
          },
        },
      },
    });

    console.log("User data from DB:", JSON.stringify(user, null, 2));

    if (!user) {
      console.warn("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    let avgRating = null;

    if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
      const allRatings = user.stores.flatMap((store) => store.ratings);
      if (allRatings.length > 0) {
        const total = allRatings.reduce((sum, rating) => sum + rating.rating, 0);
        avgRating = total / allRatings.length;
        console.log(`Computed average rating: ${avgRating}`);
      } else {
        console.log("Store owner has no ratings yet.");
      }
    }

    const response = {
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      rating: avgRating !== null ? avgRating.toFixed(2) : undefined,
    };

    console.log("Sending response:", response);
    res.json(response);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getStoreOwners = async (req, res) => {
  try {
    const storeOwners = await prisma.user.findMany({
      where: {
        role: 'STORE_OWNER',
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.json(storeOwners);
  } catch (error) {
    console.error("Error fetching store owners:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

