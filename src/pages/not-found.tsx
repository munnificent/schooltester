import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <AlertTriangle className="mx-auto h-16 w-16 text-primary mb-4" />
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-primary tracking-tighter">
          404
        </h1>
        
        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">
          Страница не найдена
        </h2>
        
        <p className="mt-4 text-muted-foreground">
          Ой! Страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <Home className="h-5 w-5" />
            Вернуться на главную
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;