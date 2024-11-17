# Assignment Submission Portal Documentation

---

# Overview

The **Assignment Submission Portal** is designed for seamless assignment submissions by users and efficient review and management by admins. The backend system supports registration, authentication, assignment uploads, and approval workflows.

## Features

- **User Management**: Register, log in, and upload assignments.
- **Admin Management**: Register, log in, and manage assignments (accept/reject).
- **Authentication**: Secure access using JWT.
- **Input Validation**: Comprehensive validation using Zod.
- **Password Security**: Encryption with bcrypt.

## 🛠️ Technology Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT** for authentication
- **Zod** for validation
- **bcrypt** for password hashing
- **TypeScript** for type safety

### Overview of Your Project Structure:

- **`src/config/db.ts`**: Database connection setup.
- **`src/controllers/route.ts`**: Controller logic for routes.
- **`src/middlewares`**:
    - `adminCheckMiddleware.ts`: Likely handles admin-specific authorization checks.
    - `authMiddleware.ts`: Middleware for general authentication.
    - `errorHandler.ts`: Centralized error handling.
- **`src/models`**:
    - `adminSchema.ts`: Schema for admin data.
    - `assignmentSchema.ts`: Schema for assignment data.
    - `userSchema.ts`: Schema for user data.
- **`src/routes`**:
    - `adminRoutes.ts`: Routes specific to admin actions.
    - `userRoutes.ts`: Routes for user actions.
- **`src/schemas`**:
    - `assignmentSchema.ts`: Validation schema for assignment data.
    - `signUpSchema.ts`: Validation schema for signup inputs.
- **`src/utils/appError.ts`**: Custom error class for handling application errors.
- **`index.ts`**: Entry point of the application.

## 🗂️ Project Structure

```
project-root/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   └── route.ts
│   ├── middlewares/
│   │   ├── adminCheckMiddleware.ts
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── adminSchema.ts
│   │   ├── assignmentSchema.ts
│   │   └── userSchema.ts
│   ├── routes/
│   │   ├── adminRoutes.ts
│   │   └── userRoutes.ts
│   ├── schemas/
│   │   ├── assignmentSchema.ts
│   │   └── signUpSchema.ts
│   ├── utils/
│   │   └── appError.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md  (Recommended to add)

```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/yourusername/assignment-portal.git>
cd assignment-portal

```

### 2. Install Dependencies

```
npm install
tsc //To convert Typescript file to Javascript files a dist folder is created
```

### 3. Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key

```

### 4. Run the Development Server

```bash
node dist/index.js
```

### 5. Transpile and Run in Production

```bash
npm run build
npm start
```

## 🔗 API Endpoints

### User Routes

- **POST** `/users/signup` - Register a new user.
- **POST** `/users/login` - User login.
- **POST** `/users/upload` - Upload an assignment.
- **GET** `/users/assignments` - Retrieve all assignments for the logged-in user.

### Admin Routes

- **POST** `/admins/signup` - Register a new admin.
- **POST** `/admins/login` - Admin login.
- **GET** `/admins/assignments` - View assignments tagged to the admin.
- **POST** `/admins/assignments/:id/accept` - Accept an assignment.
- **POST** `/admins/assignments/:id/reject` - Reject an assignment.

## 🔐 Authentication Middleware

```tsx
export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || "";
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({ message: 'Unauthorized access' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET!) as { userId?: string; adminId?: string };
        if (decoded.userId) req.userId = decoded.userId;
        if (decoded.adminId) req.adminId = decoded.adminId;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

```

## ❌ Error Handling

Centralized error handling ensures a consistent response for invalid or unauthorized requests.

### Example Error Class

```tsx
export class AppError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
    }
}

```

## 🧑‍💻 Usage Guide

### User Workflow:

1. Register and log in using `/users/signup` and `/users/login`.
2. Upload assignments through `/users/upload`.
3. View uploaded assignments with `/users/assignments`.

### Admin Workflow:

1. Register and log in using `/admins/signup` and `/admins/login`.
2. View pending assignments with `/admins/assignments`.
3. Accept or reject assignments using `/admins/assignments/:id/accept` and `/admins/assignments/:id/reject`.

---
