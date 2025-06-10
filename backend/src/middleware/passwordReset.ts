import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Şifre sıfırlama isteği limiter
export const passwordResetRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 3, // 3 istek
  message:
    "Çok fazla şifre sıfırlama isteği. Lütfen 1 saat sonra tekrar deneyin.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Şifre sıfırlama doğrulama limiter
export const passwordResetVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // 5 deneme
  message:
    "Çok fazla doğrulama denemesi. Lütfen 15 dakika sonra tekrar deneyin.",
  standardHeaders: true,
  legacyHeaders: false,
});
