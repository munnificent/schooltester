import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, Star, Users, Calendar, Heart, GraduationCap,
  Plus, Minus
} from 'lucide-react';
import { RequestFormModal } from '../components/modals/request-form-modal';

// --- Wrapper Components ---
const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string, id?: string }> = ({ children, className = '', id }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
    className={`container mx-auto px-4 py-16 md:py-24 ${className}`}
  >
    {children}
  </motion.section>
);

const SectionHeader: React.FC<{ title: string; subtitle: string; className?: string }> = ({ title, subtitle, className='' }) => (
  <div className={`text-center max-w-3xl mx-auto mb-12 ${className}`}>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
    <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
  </div>
);


// --- Page Sections ---
const PricingSection: React.FC<{ onSelectPlan: () => void }> = ({ onSelectPlan }) => {
  const packages = [
    {
      name: "Базовый",
      description: "Для точечной помощи по одному предмету.",
      price: "15 000",
      features: ["1 предмет", "4 занятия в месяц", "Доступ к записям уроков", "Домашние задания"],
      popular: false
    },
    {
      name: "Стандарт",
      description: "Лучший баланс для комплексной подготовки.",
      price: "25 000",
      features: ["До 2 предметов", "8 занятий в месяц", "Пробные тесты", "Консультации с методистом"],
      popular: true
    },
    {
      name: "Премиум",
      description: "Максимальный фокус для гарантированного результата.",
      price: "45 000",
      features: ["До 3 предметов", "12 занятий в месяц", "Индивидуальные консультации", "Приоритетная поддержка"],
      popular: false
    }
  ];

  return (
    <SectionWrapper className="bg-muted">
      <SectionHeader title="Выберите свой тариф" subtitle="Прозрачные цены и гибкие планы для достижения ваших целей."/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`rounded-xl border shadow-sm flex flex-col p-6 ${pkg.popular ? 'border-2 border-primary bg-card relative' : 'bg-card'}`}>
            {pkg.popular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-medium text-primary-foreground bg-primary rounded-full">
                Популярный выбор
              </div>
            )}
            <h3 className="text-xl font-bold">{pkg.name}</h3>
            <p className="text-muted-foreground mt-2">{pkg.description}</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold">{pkg.price}</span>
              <span className="text-muted-foreground"> тг/месяц</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onSelectPlan}
              className={`w-full mt-auto inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${pkg.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80'}`}
            >
              Выбрать план
            </button>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

const FaqItem: React.FC<{ q: string; a: string; isOpen: boolean; onClick: () => void; }> = ({ q, a, isOpen, onClick }) => (
    <div className="border-b">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left py-4">
            <span className="font-semibold text-foreground">{q}</span>
            {isOpen ? <Minus className="h-5 w-5 text-primary"/> : <Plus className="h-5 w-5 text-muted-foreground"/>}
        </button>
        <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0, marginTop: isOpen ? '0rem' : '0rem' }}
            className="overflow-hidden"
        >
            <p className="pb-4 text-muted-foreground">{a}</p>
        </motion.div>
    </div>
);


const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    // TODO: Заменить на данные с API
    const faqs = [
        { q: "Как проходят занятия?", a: "Занятия проходят онлайн через платформу Zoom. Каждое занятие длится 60-90 минут. Все уроки записываются, и у учеников есть доступ к этим записям." },
        { q: "Как оценивается прогресс ученика?", a: "Мы регулярно проводим тестирования, а преподаватели ведут подробную статистику по каждому ученику, отслеживая успехи и выявляя области, требующие дополнительного внимания." },
        { q: "Что делать, если я пропустил занятие?", a: "Все занятия записываются. Вы всегда можете просмотреть пропущенный урок в личном кабинете и задать вопросы преподавателю." },
        { q: "Можно ли сменить преподавателя или курс?", a: "Да, мы гибко подходим к обучению. Если вам что-то не подошло, мы с радостью предложим другого специалиста или поможем сменить направление подготовки." },
    ];
    
    return (
        <SectionWrapper>
            <SectionHeader title="Часто задаваемые вопросы" subtitle="Нашли ответ на свой вопрос? Если нет — свяжитесь с нами!" />
            <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <FaqItem 
                        key={index}
                        q={faq.q}
                        a={faq.a}
                        isOpen={openIndex === index}
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                ))}
            </div>
        </SectionWrapper>
    );
};


// --- Main Page Component ---
const CoursesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main>
        {/* Hero */}
        <SectionWrapper className="text-center !pt-24 !pb-20 bg-background">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Наши курсы и цены</h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                Выберите подходящий формат обучения для достижения ваших образовательных целей.
            </p>
        </SectionWrapper>
        
        {/* Pricing */}
        <PricingSection onSelectPlan={() => setIsModalOpen(true)} />

        {/* FAQ */}
        <FaqSection />

        {/* Modal Window */}
        {/* TODO: Модальное окно нужно будет вынести в переиспользуемый компонент */}
        <RequestFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </main>
  );
};

export default CoursesPage;