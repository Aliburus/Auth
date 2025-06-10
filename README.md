# Auth App

Modern, profesyonel ve güvenli bir kimlik doğrulama sistemi.

## Özellikler

- JWT ve HttpOnly cookie ile güvenli oturum yönetimi
- React + Vite + Tailwind ile modern frontend
- Express.js + MongoDB ile backend
- Kayıt, giriş, şifre sıfırlama, kullanıcı doğrulama
- Input validasyonları ve hata mesajları
- Responsive ve şık arayüz

## Kurulum

### 1. Depoyu Klonla

```bash
git clone <repo-link>
cd Auth
```

### 2. Ortam Değişkenlerini Ayarla

`.env` ve `.env.local` dosyalarını oluşturup aşağıdaki örneğe göre doldurun:

```env
# Backend için
MONGO_URI=mongodb://localhost:27017/authdb
JWT_SECRET=supersecretkey
FRONTEND_URL=http://localhost:5173
COOKIE_DOMAIN=localhost
NODE_ENV=development
PORT=5000

# Frontend için
VITE_API_URL=http://localhost:5000
```

### 3. Bağımlılıkları Kur

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../
npm install
```

### 4. Çalıştır

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd ../
npm run dev
```

## Kullanım

- `/login` ve `/register` ile giriş/kayıt olabilirsin.
- Şifremi unuttum ve şifre sıfırlama akışı mevcut.
- Tüm validasyon ve hata mesajları Türkçe.

## Katkı

PR ve issue açabilirsin. Kodlar temiz ve anlaşılır tutulmuştur.

## Lisans

MIT
