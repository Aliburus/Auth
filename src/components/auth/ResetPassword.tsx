import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";

const schema = yup.object({
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

type ResetPasswordFormData = yup.InferType<typeof schema>;

const ResetPassword = () => {
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setMessage("Geçersiz veya eksik token");
      return;
    }

    try {
      await api.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });
      setMessage("Şifreniz başarıyla güncellendi");
    } catch (error) {
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Şifre Sıfırlama
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                Yeni Şifre
              </label>
              <input
                {...register("password")}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Yeni Şifre"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Şifre Tekrarı
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Şifre Tekrarı"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {message && (
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">{message}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Şifreyi Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
