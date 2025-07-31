import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  let title = "Упс! Что-то пошло не так.";
  let message = "Неизвестная ошибка. Попробуйте позже.";
  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.statusText || title;
    message = error.data?.message || error.data || message;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="h-screen flex flex-col justify-center items-center text-center px-4"
    >
      <div className="max-w-md w-full space-y-6">
        <AlertTriangle className="mx-auto text-destructive" size={48} />
        <h1 className="text-4xl font-bold text-foreground">{status}</h1>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{message}</p>

        <Link to="/">
          <button className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
            Вернуться на главную
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ErrorPage;

