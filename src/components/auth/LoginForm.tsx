import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir email girin")
    .required("Email gerekli"),
  password: yup.string().required("Şifre gerekli"),
});

type LoginFormData = yup.InferType<typeof schema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <input
          {...register("email")}
          type="email"
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
          placeholder="Email adresi"
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
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
      <div className="text-center mt-2">
        <Link
          to="/forgot-password"
          className="text-indigo-600 hover:underline text-sm"
        >
          Şifremi unuttum
        </Link>
      </div>
    </form>
  );
}
