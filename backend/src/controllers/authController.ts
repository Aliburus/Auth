import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "../utils/mailer";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Token oluşturma fonksiyonu
const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    // Email kontrolü
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "Bu email zaten kullanımda" });
      return;
    }

    // Kullanıcı oluştur
    const user = await User.create({
      email,
      password,
      username,
    });

    // Token oluştur
    const token = generateToken(user._id.toString());

    // Cookie'ye token'ı kaydet
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 gün
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Kayıt işlemi başarısız" });
  }
};

// Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Geçersiz email veya şifre" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Geçersiz email veya şifre" });
      return;
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : "localhost",
    });

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Giriş işlemi başarısız" });
  }
};

// Logout
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ message: "Çıkış başarılı" });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(404)
        .json({ message: "Bu email adresi ile kayıtlı kullanıcı bulunamadı" });
      return;
    }

    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    res.json({
      message: "Şifre sıfırlama bağlantısı email adresinize gönderildi",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Şifre sıfırlama işlemi başarısız" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: "Geçersiz veya süresi dolmuş token" });
      return;
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Şifreniz başarıyla güncellendi" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Şifre sıfırlama işlemi başarısız" });
  }
};
