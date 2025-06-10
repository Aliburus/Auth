import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { LoginFormData, RegisterFormData } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";

type AuthMode = "login" | "register";

const AuthContainer: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
    } catch (error: any) {
      setError(error.response?.data?.message || "Geçersiz email veya şifre");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await register(data.username, data.email, data.password);
      setMode("login");
    } catch (error: any) {
      setError(error.response?.data?.message || "Kayıt işlemi başarısız");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {mode === "login" ? "Hoş Geldiniz" : "Hesap Oluştur"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {mode === "login"
                ? "Devam etmek için giriş yapın"
                : "Hemen kayıt olun"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg flex items-center bg-red-50 text-red-800 border border-red-200">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Forms */}
          {mode === "login" ? (
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          ) : (
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
          )}

          {/* Mode Switch */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm font-semibold text-indigo-600 hover:underline focus:outline-none"
            >
              {mode === "login"
                ? "Hesabınız yok mu? Kayıt olun"
                : "Zaten hesabınız var mı? Giriş yapın"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
