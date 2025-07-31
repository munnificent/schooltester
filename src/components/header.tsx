//src/components/header.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/courses', label: 'Курсы' },
  { href: '/about-us', label: 'О нас' }, // файл src/pages/about-us.tsx
  { href: '/blog', label: 'Блог' },
];

// Примечание: В будущем этот компонент будет принимать `onApplyClick` из PublicLayout
const Header: React.FC<{ onApplyClick: () => void }> = ({ onApplyClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Эффект для определения, проскроллена ли страница, для добавления тени
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLinkClass = "text-primary font-semibold";
  const inactiveLinkClass = "text-foreground/80 hover:text-primary";

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-md' : 'bg-background'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Логотип */}
          <Link to="/" className="text-xl font-bold text-foreground">
            Munificent <span className="text-primary">School</span>
          </Link>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} transition-colors`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Кнопки для десктопа */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
                Войти
            </Link>
            <button
                onClick={onApplyClick}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
                Оставить заявку
            </button>
          </div>
          
          {/* Кнопка мобильного меню */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t"
          >
            <nav className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `px-3 py-2 rounded-md text-base ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                 <Link to="/login" className="w-full text-center px-4 py-2 text-sm font-medium transition-colors rounded-md bg-muted hover:bg-muted/80">
                    Войти
                </Link>
                <button
                    onClick={() => {
                        onApplyClick();
                        setIsMenuOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm"
                >
                    Оставить заявку
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;