import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object({
  username: yup.string().required("Kullanıcı adı gerekli"),
  email: yup
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .required("E-posta adresi gerekli"),
  password: yup
    .string()
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .matches(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
    .matches(/[a-z]/, "Şifre en az bir küçük harf içermelidir")
    .matches(/[0-9]/, "Şifre en az bir rakam içermelidir")
    .matches(/[^A-Za-z0-9]/, "Şifre en az bir özel karakter içermelidir")
    .required("Şifre gerekli"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı gerekli"),
});

type RegisterFormData = yup.InferType<typeof schema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
  const [error, setError] = useState("");
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = async (data: RegisterFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Kayıt başarısız");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Kayıt Ol
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="space-y-4">
            <input
              {...register("username")}
              type="text"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              placeholder="Kullanıcı Adı"
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
            <input
              {...register("email")}
              type="email"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              placeholder="E-posta Adresi"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
            <input
              {...register("password")}
              type="password"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              placeholder="Şifre"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
            <input
              {...register("confirmPassword")}
              type="password"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              placeholder="Şifre Tekrarı"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Zaten hesabınız var mı? Giriş yapın
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
