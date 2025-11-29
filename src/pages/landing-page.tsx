import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, Award, CheckCircle, ArrowRight,
  Star, Play, Menu, BrainCircuit, Phone
} from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RequestFormModal } from '../components/modals/request-form-modal';
import apiClient from '../api/apiClient';
import { TeacherPublic, ReviewPublic, PaginatedResponse } from '../types';

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
            aria-label="Оставить заявку на обучение"
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
  const [teachers, setTeachers] = useState<TeacherPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<PaginatedResponse<TeacherPublic>>('/public-teachers/')
      .then(res => {
        // Handle paginated response - extract results array
        if (res.data && Array.isArray(res.data.results)) {
          setTeachers(res.data.results);
        } else if (Array.isArray(res.data)) {
          // Fallback for non-paginated response
          setTeachers(res.data as any);
        } else {
          setError('Invalid response format');
        }
      })
      .catch(err => {
        console.error("Failed to fetch teachers", err);
        setError('Не удалось загрузить преподавателей');
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="text-center py-12">Загрузка преподавателей...</div>;
  if (error) return <div className="text-center py-12 text-destructive">{error}</div>;
  if (teachers.length === 0) return <div className="text-center py-12 text-muted-foreground">Преподаватели не найдены</div>;

  return (
    <SectionWrapper>
      <SectionHeader title="Наши преподаватели" subtitle="Профессионалы, которые любят свое дело и вдохновляют на результат." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="text-center group">
            <img
              src={teacher.profile?.avatar || 'https://via.placeholder.com/256'}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-transparent group-hover:border-primary transition-all duration-300"
            />
            <h3 className="mt-4 text-xl font-semibold text-foreground">{teacher.firstName} {teacher.lastName}</h3>
            <p className="text-primary">{teacher.profile?.publicSubjects || 'Преподаватель'}</p>
            <p className="text-sm text-muted-foreground">{teacher.profile?.experience || ''}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};


const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<PaginatedResponse<ReviewPublic>>('/reviews/')
      .then(res => {
        // Handle paginated response - extract results array
        if (res.data && Array.isArray(res.data.results)) {
          setReviews(res.data.results);
        } else if (Array.isArray(res.data)) {
          // Fallback for non-paginated response
          setReviews(res.data as any);
        } else {
          setError('Invalid response format');
        }
      })
      .catch(err => {
        console.error("Failed to fetch reviews", err);
        setError('Не удалось загрузить отзывы');
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="text-center py-12">Загрузка отзывов...</div>;
  if (error) return <div className="text-center py-12 text-destructive">{error}</div>;
  if (reviews.length === 0) return <div className="text-center py-12 text-muted-foreground">Отзывы не найдены</div>;

  return (
    <SectionWrapper className="bg-muted">
      <SectionHeader title="Что говорят наши ученики" subtitle="Мы гордимся результатами и отзывами наших студентов." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card p-6 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center mb-2">
              {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />)}
            </div>
            <p className="text-muted-foreground mb-4 flex-grow">"{review.text}"</p>
            <p className="font-semibold text-foreground">- {review.author}</p>
            {review.scoreInfo && <p className="text-xs text-primary mt-1">{review.scoreInfo}</p>}
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
          aria-label="Получить консультацию по телефону"
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