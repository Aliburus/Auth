import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // CSRF token oluştur
  const csrfToken = crypto.randomBytes(32).toString("hex");

  // Token'ı cookie'ye kaydet
  res.cookie("csrf-token", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Token'ı response header'a ekle
  res.setHeader("X-CSRF-Token", csrfToken);

  next();
};
