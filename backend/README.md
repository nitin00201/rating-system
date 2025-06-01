
---

### 📦 Backend Setup Guide

#### 🛠 1. Clone the Backend Repository

```bash
git clone https://github.com/nitin00201/rating-system.git
cd backend
```

---

#### 🧪 2. Setup Neon Database

1. Go to [Neon](https://neon.tech)
2. Create a new database
3. Copy the connection string

> 🔐 Replace the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL="postgresql://neondb_owner:npg_g7reaBUYsS0x@ep-purple-math-a8xe9yzs-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
JWT_SECRET=your_super_secret_jwt_key
PORT=4000
```

---

#### 📦 3. Install Dependencies

```bash
npm install
# npm install @prisma/client
```

---

#### 🧬 4. Prisma Setup



> 🔁 To reset the database:

```bash
npx prisma migrate reset
```

---

#### 🔌 5. Prisma Client Import

```ts
import { PrismaClient } from './generated/client'
```

---

#### 🚀 6. Start the Server

```bash
npm run dev
```

> The backend should now be running on: `http://localhost:4000`

---

### 🧾 Sample Data

#### 👤 Users

```json
{
  "name": "Emily Rose Thompson",
  "email": "emily.thompson@example.com",
  "password": "Admin@1234",
  "address": "456 Oak Avenue, Riverdale",
  "role": "SYSTEM_ADMINISTRATOR"
}
```

```json
{
  "name": "Johnathan Maxwell Anderson",
  "email": "john.maxwell@example.com",
  "password": "Secure@123",
  "address": "123 Elm Street, Springfield",
  "role": "NORMAL_USER"
}
```

```json
{
  "name": "Michael Storeman",
  "email": "michael.storeman@example.com",
  "password": "Store@123",
  "address": "789 Pine Road, Lakeview",
  "role": "STORE_OWNER"
}
```

---

#### 🏪 Stores

```json
{
  "name": "Tech World",
  "email": "contact@techworld.com",
  "address": "99 Silicon Alley, San Francisco",
  "ownerId": 3
}
```

```json
{
  "name": "Fresh Mart",
  "email": "support@freshmart.com",
  "address": "88 Organic St, Greenfield",
  "ownerId": 9
}
```

---

Let me know if you'd like this saved as a downloadable file (`setup.md`) or included in your codebase.
