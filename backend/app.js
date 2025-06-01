import express from "express";
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import storeOwnerRoutes from "./routes/storeOwnerRoutes.js";
import cors from 'cors'; 
import { authenticateToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173", // allow your frontend origin
    credentials: true, // if you're using cookies or auth headers
  }));
app.use(express.json());
// app.use(authenticateToken)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/store-owner', storeOwnerRoutes);




app.get('/', (req, res) => {
    res.send('API is running!');
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})