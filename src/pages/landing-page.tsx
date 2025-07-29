import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Award, BrainCircuit, Users, BookOpen,
  Star, Phone, Send, X, Loader2
} from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
// ИСПРАВЛЕННЫЙ ИМПОРТ
import apiClient from '../api/apiClient';

// --- Wrapper Components ---
const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string, id?: string }> = ({ children, className = '', id }) => (
  <motion.section id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
    className={`container mx-auto px-4 py-16 md:py-24 ${className}`}
  >
    {children}
  </motion.section>
);

const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="text-center max-w-2xl mx-auto mb-12">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
    <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
  </div>
);


// --- Page Sections ---

const HeroSection: React.FC<{ onApplyClick: () => void }> = ({ onApplyClick }) => (
  <div className="relative bg-background overflow-hidden">
    <div className="container mx-auto px-4 py-24 md:py-32 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground">
          Достигните <span className="text-primary">новых высот</span> в учебе
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Современная образовательная платформа для подготовки к ЕНТ и повышения успеваемости с лучшими преподавателями.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onApplyClick}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          >
            Оставить заявку <ArrowRight className="h-5 w-5" />
          </button>
          <a href="#advantages" className="inline-flex items-center justify-center rounded-md bg-transparent px-8 py-3 text-base font-medium text-foreground border border-border hover:bg-muted">
            Узнать больше
          </a>
        </div>
      </motion.div>
    </div>
  </div>
);

const AdvantagesSection: React.FC = () => {
    const advantages = [
        { icon: Award, title: 'Опытные преподаватели', description: 'Наши учителя — эксперты в своих предметах с многолетним опытом подготовки.' },
        { icon: BrainCircuit, title: 'Современные методики', description: 'Мы используем интерактивные подходы и технологии для лучшего усвоения материала.' },
        { icon: Users, title: 'Малые группы', description: 'Оптимальный размер групп позволяет уделить внимание каждому ученику.' },
        { icon: BookOpen, title: 'Пробные тесты', description: 'Регулярные симуляции ЕНТ для отслеживания прогресса и привыкания к формату.' },
    ];

    return (
        <SectionWrapper id="advantages" className="bg-muted">
            <SectionHeader title="Почему выбирают Munificent School?" subtitle="Мы создали все условия для вашего успеха." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {advantages.map((adv, index) => (
                    <div key={index} className="text-center p-6 bg-card rounded-xl shadow-sm">
                        <div className="flex justify-center items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <adv.icon className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{adv.title}</h3>
                        <p className="mt-2 text-muted-foreground text-sm">{adv.description}</p>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const TeachersSection: React.FC = () => {
    // TODO: Заменить на данные с API
    const teachers = [
        { name: 'Айжан Берикова', subject: 'Математика', experience: '8 лет опыта', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?&w=256&h=256&fit=crop' },
        { name: 'Тимур Сапаров', subject: 'История Казахстана', experience: '10 лет опыта', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?&w=256&h=256&fit=crop' },
        { name: 'Ермек Жангиров', subject: 'Физика', experience: '6 лет опыта', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?&w=256&h=256&fit=crop' },
        { name: 'Гульнара Асетова', subject: 'Химия и Биология', experience: '12 лет опыта', avatar: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?&w=256&h=256&fit=crop' },
    ];
    return (
        <SectionWrapper>
            <SectionHeader title="Наши преподаватели" subtitle="Профессионалы, которые любят свое дело и вдохновляют на результат." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teachers.map((teacher, index) => (
                    <div key={index} className="text-center group">
                        <img src={teacher.avatar} alt={teacher.name} className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-transparent group-hover:border-primary transition-all duration-300"/>
                        <h3 className="mt-4 text-xl font-semibold text-foreground">{teacher.name}</h3>
                        <p className="text-primary">{teacher.subject}</p>
                        <p className="text-sm text-muted-foreground">{teacher.experience}</p>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};


const ReviewsSection: React.FC = () => {
    // TODO: Заменить на данные с API
    const reviews = [
        { name: 'Алия', text: 'Очень сильная подготовка по математике! Айжан Бериковна объясняет все очень доступно. Сдала на 35+ баллов!', rating: 5 },
        { name: 'Данияр', text: 'Занимался историей у Тимура Агаевича. Уроки были интересными, много фактов, которых нет в учебниках. Спасибо!', rating: 5 },
        { name: 'Сабина', text: 'Пробные тесты очень помогли справиться с волнением на самом ЕНТ. Атмосфера в центре дружелюбная.', rating: 5 },
    ];
    return (
        <SectionWrapper className="bg-muted">
            <SectionHeader title="Что говорят наши ученики" subtitle="Мы гордимся результатами и отзывами наших студентов." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                    <div key={index} className="bg-card p-6 rounded-xl shadow-sm flex flex-col">
                        <div className="flex items-center mb-2">
                           {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />)}
                        </div>
                        <p className="text-muted-foreground mb-4 flex-grow">"{review.text}"</p>
                        <p className="font-semibold text-foreground">- {review.name}</p>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const CalculatorSection: React.FC<{ onApplyClick: () => void }> = ({ onApplyClick }) => (
  <SectionWrapper>
    <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Готовы начать?</h2>
        <p className="mt-2 text-lg text-primary-foreground/80">Оставьте заявку, и мы подберем для вас идеальную программу подготовки.</p>
      </div>
      <div className="mt-6 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
        <button
          onClick={onApplyClick}
          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-white px-8 py-3 text-base font-medium text-primary shadow-lg transition-transform hover:scale-105"
        >
          <Phone className="h-5 w-5" /> Получить консультацию
        </button>
      </div>
    </div>
  </SectionWrapper>
);


// --- Modal Window ---
type ApplyFormInputs = { name: string; phone: string; };

const RequestFormModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { register, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<ApplyFormInputs>();
    
    const onSubmit: SubmitHandler<ApplyFormInputs> = async (data) => {
        try {
            await apiClient.post('/applications/', data);
            toast.success('Спасибо за заявку! Мы скоро с вами свяжемся.');
            reset();
            onClose();
        } catch (error) {
            toast.error('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
        }
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card rounded-xl shadow-2xl w-full max-w-md"
            >
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">Оставить заявку</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-muted"><X size={20}/></button>
                </header>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Ваше имя</label>
                        <input id="name" {...register('name', { required: true })} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="text-sm font-medium">Номер телефона</label>
                        <input id="phone" type="tel" {...register('phone', { required: true })} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        Отправить
                    </button>
                </form>
            </motion.div>
        </div>
    );
};


// --- Main Page Component ---
const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NOTE: Header и Footer теперь должны рендериться в PublicLayout
  return (
    <main>
      <HeroSection onApplyClick={() => setIsModalOpen(true)} />
      <AdvantagesSection />
      <TeachersSection />
      <ReviewsSection />
      <CalculatorSection onApplyClick={() => setIsModalOpen(true)} />

      <RequestFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};

export default LandingPage;