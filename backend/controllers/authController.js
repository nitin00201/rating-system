import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/client.js'
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
export const register = async (req, res) => {
    const { name, email, password, address, role } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: {
          name,
          email,
          address,
          password: hashedPassword,
          role: role || 'NORMAL_USER',
        },
      });
  
      res.status(201).json({ message: 'User created', userId: user.id });
    } catch (err) {
      res.status(500).json({ message: 'Registration error', error: err.message });
    }
  };
  

export const logout = (req, res) => {
  // Token is deleted on client-side
  res.json({ message: 'Logout successful. Delete token on client side.' });
};
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
