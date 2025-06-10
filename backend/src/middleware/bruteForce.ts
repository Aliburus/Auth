import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // 5 başarısız deneme
  message:
    "Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip + req.body.email; // IP + email kombinasyonu
  },
});
