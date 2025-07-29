import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Lightbulb, Shield, Award, Users, BookOpen, GraduationCap } from 'lucide-react';
// import { RequestFormModal } from '../components/modals/RequestFormModal'; // TODO: Создать этот компонент

// --- Данные страницы ---
const PAGE_CONTENT = {
  hero: { title: "О нашей школе", subtitle: "Наша миссия — помогать ученикам раскрывать свой потенциал и достигать академических высот." },
  story: {
    title: "Наша история",
    paragraphs: [
      "Munificent School была основана в 2015 году с верой в то, что образование должно быть увлекательным и эффективным. Мы начинали с небольшой группы учеников, помогая им подготовиться к важным экзаменам.",
      "Сегодня мы — полноценный образовательный центр, который предлагает поддержку по всем основным предметам. 97% наших учеников улучшают свои оценки, а 88% поступают в топовые вузы."
    ],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1740&auto=format&fit=crop",
  },
  stats: [
      { icon: Award, value: "97%", label: "улучшили оценки" },
      { icon: GraduationCap, value: "88%", label: "поступили в топ-вузы" },
      { icon: Users, value: "1500+", label: "успешных студентов" },
      { icon: BookOpen, value: "25+", label: "преподавателей" }
  ],
  values: {
    title: "Наши ценности",
    items: [
      { icon: Heart, title: "Индивидуальный подход", description: "Мы признаем уникальность каждого ученика и адаптируем методики под его особенности." },
      { icon: Lightbulb, title: "Инновационные методики", description: "Мы постоянно совершенствуем наши программы, внедряя современные технологии." },
      { icon: Shield, title: "Поддержка и доверие", description: "Мы создаем безопасную среду, где ученики не боятся ошибаться и задавать вопросы." },
    ]
  },
  team: {
    title: "Наша команда",
    subtitle: "Профессионалы, которые ежедневно помогают ученикам достигать новых высот.",
    members: [
        { name: "Асан Тасанов", role: "Основатель и директор", photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?&w=256&h=256&fit=crop" },
        { name: "Айгерим Нурсултанова", role: "Руководитель программ", photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?&w=256&h=256&fit=crop" },
        { name: "Данияр Серикулы", role: "Старший преподаватель", photoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?&w=256&h=256&fit=crop" },
        { name: "Алия Касымова", role: "Методист", photoUrl: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?&w=256&h=256&fit=crop" }
    ]
  },
  cta: { title: "Готовы начать образовательное путешествие?", buttonText: "Оставить заявку" }
};

// --- Компоненты-секции ---
const Section: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className = '' }) => (
    <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className={`container mx-auto px-4 py-16 md:py-24 ${className}`}
    >
        {children}
    </motion.section>
);

const HeroSection = () => (
    <div className="bg-muted">
        <Section className="text-center !py-20 md:!py-28">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{PAGE_CONTENT.hero.title}</h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">{PAGE_CONTENT.hero.subtitle}</p>
        </Section>
    </div>
);

const StorySection = () => (
    <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg text-foreground max-w-none">
                <h2 className="text-3xl font-bold tracking-tight">{PAGE_CONTENT.story.title}</h2>
                {PAGE_CONTENT.story.paragraphs.map((p, i) => <p key={i} className="text-muted-foreground">{p}</p>)}
            </div>
            <div className="order-first lg:order-last">
                <img src={PAGE_CONTENT.story.imageUrl} alt="Студенты в аудитории" className="w-full h-auto rounded-xl object-cover shadow-lg"/>
            </div>
        </div>
    </Section>
);

const StatsSection = () => (
    <div className="bg-primary text-primary-foreground">
        <Section className="!py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {PAGE_CONTENT.stats.map((item, index) => (
                    <div key={index} className="text-center">
                        <div className="flex justify-center items-center gap-2">
                           <item.icon className="h-8 w-8 opacity-80" />
                           <p className="text-4xl md:text-5xl font-bold">{item.value}</p>
                        </div>
                        <p className="mt-2 text-sm opacity-80 uppercase tracking-wider">{item.label}</p>
                    </div>
                ))}
            </div>
        </Section>
    </div>
);

const ValuesSection = () => (
    <Section className="bg-muted">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">{PAGE_CONTENT.values.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PAGE_CONTENT.values.items.map((item) => (
                <div key={item.title} className="bg-card p-6 rounded-lg text-center">
                    <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                        <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-muted-foreground text-sm">{item.description}</p>
                </div>
            ))}
        </div>
    </Section>
);

const TeamSection = () => (
    <Section>
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4">{PAGE_CONTENT.team.title}</h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">{PAGE_CONTENT.team.subtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PAGE_CONTENT.team.members.map((member) => (
                <div key={member.name} className="text-center">
                    <img src={member.photoUrl} alt={member.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                </div>
            ))}
        </div>
    </Section>
);

const CtaSection: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => (
    <div className="bg-muted">
        <Section className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">{PAGE_CONTENT.cta.title}</h2>
            <div className="mt-8">
                <button
                    onClick={onOpenModal}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                    {PAGE_CONTENT.cta.buttonText}
                </button>
            </div>
        </Section>
    </div>
);


// --- Основной компонент страницы ---
const AboutUsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main>
            <HeroSection />
            <StorySection />
            <StatsSection />
            <ValuesSection />
            <TeamSection />
            <CtaSection onOpenModal={() => setIsModalOpen(true)} />
            
            {/* TODO: Модальное окно нужно будет вынести в переиспользуемый компонент */}
            {/* <RequestFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
        </main>
    );
};

export default AboutUsPage;