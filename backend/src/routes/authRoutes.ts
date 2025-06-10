import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { validateRegister, validateLogin } from "../middleware/validator";
import { csrfProtection } from "../middleware/csrf";
import { loginLimiter } from "../middleware/bruteForce";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/register", csrfProtection, validateRegister, register);
router.post("/login", csrfProtection, loginLimiter, validateLogin, login);
router.post("/logout", csrfProtection, logout);
router.get("/me", csrfProtection, authenticate, getMe);
router.post("/forgot-password", csrfProtection, forgotPassword);
router.post("/reset-password", csrfProtection, resetPassword);

export default router;
