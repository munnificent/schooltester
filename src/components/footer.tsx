import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Send, Phone, Mail, MapPin, GraduationCap } from 'lucide-react';

// --- Данные для ссылок ---
const NAV_LINKS = [
  { href: '/courses', label: 'Курсы' },
  { href: '/about-us', label: 'О нас' },
  { href: '/blog', label: 'Блог' },
];

const SOCIAL_LINKS = [
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
  { href: 'https://youtube.com', label: 'YouTube', icon: Youtube },
  { href: 'https://t.me/yourprofile', label: 'Telegram', icon: Send },
];

const CONTACTS = [
    { type: 'link', href: 'tel:+77771234567', text: '+7 (777) 123-45-67', icon: Phone },
    { type: 'link', href: 'mailto:info@munificentschool.kz', text: 'info@munificentschool.kz', icon: Mail },
    { type: 'text', text: 'г. Алматы, ул. Достык 132', icon: MapPin },
];


const Footer: React.FC = () => {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Колонка 1: Логотип и соцсети */}
          <div className="flex flex-col gap-4">
             <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span>Munificent School</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Помогаем с учебой в школе и готовим к ЕНТ.
            </p>
            <div className="flex gap-3 mt-2">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          {/* Пустая колонка для отступа на больших экранах */}
          <div className="hidden lg:block"></div>

          {/* Колонка 2: Навигация */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Навигация</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link to={href} className="text-muted-foreground text-sm transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Колонка 3: Контакты */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Контакты</h3>
            <ul className="space-y-3">
              {CONTACTS.map(({ type, href, text, icon: Icon }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="text-muted-foreground mt-0.5 flex-shrink-0" size={16}/>
                  {type === 'link' ? (
                    <a href={href} className="text-muted-foreground text-sm transition-colors hover:text-primary">
                      {text}
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Munificent School. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;