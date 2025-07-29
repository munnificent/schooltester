import React, { useContext, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

import { AuthContext } from '../contexts/auth-context';

// --- Типы и вспомогательные компоненты ---

type LoginInputs = {
  email: string;
  password: string;
};

const FormInput: React.FC<{
  id: keyof LoginInputs;
  label: string;
  type: string;
  register: any;
  error?: string;
}> = ({ id, label, type, register, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-foreground">
      {label}
    </label>
    <div className="mt-1">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required: `${label} - обязательное поле` })}
        className={`block w-full px-3 py-2 bg-input border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
          error ? 'border-destructive' : 'border-border'
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  </div>
);

// --- Основной компонент страницы ---

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInputs>();

  const from = location.state?.from?.pathname || null;

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      // Вызываем метод login из контекста
      const loggedInUser = await login(data.email, data.password);
      
      toast.success(`Добро пожаловать, ${loggedInUser.firstName}!`);

      // Умное перенаправление:
      // 1. На страницу, куда пользователь шел изначально.
      // 2. Или на страницу по умолчанию в зависимости от роли.
      const destination = from || (loggedInUser.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      navigate(destination, { replace: true });

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Неверный email или пароль.';
      toast.error(errorMessage);
    }
  };

  // Пока идет проверка, ничего не показываем, чтобы избежать "мигания"
  if (isLoading || isAuthenticated) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div>
            {/* TODO: Заменить на логотип */}
            <h1 className="text-2xl font-bold text-primary">Munificent School</h1>
            <h2 className="mt-4 text-3xl font-extrabold text-foreground">
              Вход в аккаунт
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary/90">
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                id="email"
                label="Email"
                type="email"
                register={register}
                error={errors.email?.message}
              />
              <FormInput
                id="password"
                label="Пароль"
                type="password"
                register={register}
                error={errors.password?.message}
              />
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <LogIn className="h-5 w-5" />
                  )}
                  Войти
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      <div className="hidden lg:block relative flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=3024&auto=format&fit=crop"
          alt="Classroom"
        />
        <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
      </div>
    </div>
  );
};

export default LoginPage;