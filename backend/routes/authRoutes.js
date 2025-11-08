// routes/userRoutes.js
import express from 'express';
import { login, register } from '../controllers/authController.js';
const router = express.Router();

// GET /users
router.post('/register',register);

// GET /users/:id
router.post('/login', login);

export default router;