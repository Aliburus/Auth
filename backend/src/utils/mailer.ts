import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Şifre Sıfırlama",
    html: `
      <h1>Şifre Sıfırlama</h1>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Bu bağlantı 1 saat süreyle geçerlidir.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
