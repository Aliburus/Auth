import { Request, Response, NextFunction } from "express";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, username } = req.body;

  // Email kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ message: "Geçerli bir email adresi giriniz" });
    return;
  }

  // Şifre kontrolü
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Şifre en az 8 karakter uzunluğunda olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir",
    });
    return;
  }

  // Kullanıcı adı kontrolü
  if (!username || username.length < 3) {
    res
      .status(400)
      .json({ message: "Kullanıcı adı en az 3 karakter olmalıdır" });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email ve şifre gereklidir" });
    return;
  }

  next();
};
