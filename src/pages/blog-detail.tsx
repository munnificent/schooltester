// Adding a Blog Detail page for completeness

import React from 'react';
import { Button, Chip, Divider, Avatar } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Link as RouteLink, useParams, useHistory } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import RequestFormModal from '../components/request-form-modal';

const BlogDetail: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  
  // In a real app, you would fetch the blog post by id from an API
  const blogPost = {
    id: parseInt(id || "1"),
    title: "10 эффективных способов подготовки к ЕНТ",
    content: `
      <p>Подготовка к Единому национальному тестированию (ЕНТ) — важный этап в жизни каждого казахстанского школьника. От результатов этого экзамена зависит поступление в университет и возможность получения гранта на обучение. В этой статье мы рассмотрим 10 проверенных способов, которые помогут вам эффективно подготовиться к ЕНТ и получить высокие баллы.</p>
      
      <h2>1. Составьте детальный план подготовки</h2>
      <p>Начните с создания четкого плана, который охватывает все предметы и темы, которые будут на экзамене. Распределите время так, чтобы уделить больше внимания сложным для вас темам и не забыть повторить те, в которых вы уже хорошо разбираетесь.</p>
      
      <h2>2. Практикуйтесь с прошлогодними тестами</h2>
      <p>Один из самых эффективных способов подготовки — решение прошлогодних вариантов ЕНТ. Это поможет вам привыкнуть к формату и структуре экзамена, а также научит управлять временем.</p>
      
      <h2>3. Используйте метод интервальных повторений</h2>
      <p>Исследования показывают, что метод интервальных повторений помогает лучше усваивать и запоминать информацию. Повторяйте материал через определенные промежутки времени, увеличивая их по мере усвоения.</p>
      
      <h2>4. Создайте подходящую среду для обучения</h2>
      <p>Организуйте комфортное и спокойное место для занятий, где вас ничто не будет отвлекать. Убедитесь, что у вас есть все необходимые материалы и ресурсы под рукой.</p>
      
      <h2>5. Занимайтесь регулярно</h2>
      <p>Лучше заниматься по несколько часов каждый день, чем устраивать марафоны по 12 часов раз в неделю. Регулярность поможет вашему мозгу лучше усваивать информацию и избежать выгорания.</p>
      
      <h2>6. Используйте разнообразные учебные материалы</h2>
      <p>Не ограничивайтесь одним учебником. Используйте различные источники информации — книги, видеоуроки, онлайн-курсы, мобильные приложения. Это поможет вам получить более глубокое понимание предмета.</p>
      
      <h2>7. Обучайте других</h2>
      <p>Один из лучших способов проверить, насколько хорошо вы понимаете тему — объяснить её кому-то другому. Можно заниматься с одноклассниками или даже просто рассказывать материал вслух, представляя, что вы объясняете его кому-то.</p>
      
      <h2>8. Учите активно, а не пассивно</h2>
      <p>Не просто читайте материал — взаимодействуйте с ним. Делайте заметки, создавайте ментальные карты, задавайте вопросы к тексту, ищите связи между разными темами и предметами.</p>
      
      <h2>9. Следите за своим физическим и эмоциональным состоянием</h2>
      <p>Регулярно высыпайтесь, правильно питайтесь, занимайтесь спортом и находите время для отдыха. Помните, что ваш мозг работает лучше, когда вы здоровы и полны энергии.</p>
      
      <h2>10. Обратитесь за помощью к профессионалам</h2>
      <p>Если у вас возникают трудности с определенными предметами или темами, не стесняйтесь обратиться за помощью. Дополнительные занятия с репетитором или специализированные курсы могут значительно улучшить ваши результаты.</p>
      
      <p>В Munificent School мы предлагаем специализированные курсы подготовки к ЕНТ, которые учитывают индивидуальные особенности каждого ученика и фокусируются на наиболее эффективных методиках обучения. Наши преподаватели помогут вам не только разобраться в сложных темах, но и выработать стратегию сдачи экзамена, которая подойдет именно вам.</p>
    `,
    author: {
      name: "Айгерим Нурсултанова",
      role: "Руководитель программ по математике",
      photoUrl: "https://img.heroui.chat/image/avatar?w=300&h=300&u=1"
    },
    date: "15 сентября 2023",
    category: "подготовка к ЕНТ",
    imageUrl: "https://img.heroui.chat/image/book?w=1200&h=600&u=1",
    readTime: "7 мин"
  };
  
  const relatedPosts = [
    {
      id: 2,
      title: "Как развить навыки критического мышления у школьников",
      imageUrl: "https://img.heroui.chat/image/ai?w=400&h=200&u=2",
    },
    {
      id: 5,
      title: "Как правильно составить план подготовки к экзаменам",
      imageUrl: "https://img.heroui.chat/image/ai?w=400&h=200&u=5",
    },
    {
      id: 3,
      title: "Математика вокруг нас: как объяснить ребенку сложные концепции",
      imageUrl: "https://img.heroui.chat/image/ai?w=400&h=200&u=3",
    }
  ];
  
  return (
    <>
      <Header onOpenModal={() => setIsModalOpen(true)} />
      
      <main className="bg-background">
        <div className="relative w-full h-80 md:h-96 overflow-hidden">
          <img 
            src={blogPost.imageUrl} 
            alt={blogPost.title}
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 container mx-auto max-w-7xl">
            <Chip className="mb-4" color="primary" variant="solid">
              {blogPost.category}
            </Chip>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-white">
              {blogPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90 text-sm">
              <div className="flex items-center">
                <Icon icon="lucide:calendar" className="mr-1" width={14} />
                <span>{blogPost.date}</span>
              </div>
              <div className="flex items-center">
                <Icon icon="lucide:clock" className="mr-1" width={14} />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl py-12">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="light"
              startContent={<Icon icon="lucide:arrow-left" width={16} />}
              onPress={() => history.push('/blog')}
            >
              Назад к блогу
            </Button>
            
            <div className="flex gap-2">
              <Button isIconOnly variant="flat" aria-label="Share on Facebook">
                <Icon icon="lucide:facebook" width={20} />
              </Button>
              <Button isIconOnly variant="flat" aria-label="Share on Twitter">
                <Icon icon="lucide:twitter" width={20} />
              </Button>
              <Button isIconOnly variant="flat" aria-label="Share via Email">
                <Icon icon="lucide:mail" width={20} />
              </Button>
            </div>
          </div>
          
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }}></div>
          </article>
          
          <Divider className="my-8" />
          
          <div className="flex items-center p-6 bg-content1 rounded-lg">
            <Avatar 
              src={blogPost.author.photoUrl}
              className="w-16 h-16 mr-4"
              isBordered
            />
            <div>
              <h3 className="text-lg font-semibold">{blogPost.author.name}</h3>
              <p className="text-foreground-500">{blogPost.author.role}</p>
            </div>
          </div>
          
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Похожие статьи</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-content1 rounded-lg overflow-hidden"
                >
                  <img 
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium line-clamp-2">{post.title}</h3>
                    <Button
                      as={RouteLink}
                      to={`/blog/${post.id}`}
                      variant="light"
                      color="primary"
                      endContent={<Icon icon="lucide:arrow-right" width={16} />}
                      size="sm"
                      className="mt-3"
                    >
                      Читать
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mt-12 p-8 bg-primary rounded-lg text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Остались вопросы?</h2>
            <p className="mb-6">Запишитесь на консультацию к нашим специалистам, чтобы узнать о возможностях подготовки к ЕНТ.</p>
            <Button 
              color="secondary" 
              onPress={() => setIsModalOpen(true)}
              className="font-medium text-foreground-800"
            >
              Оставить заявку
            </Button>
          </section>
        </div>
      </main>
      
      <Footer />
      
      <RequestFormModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default BlogDetail;