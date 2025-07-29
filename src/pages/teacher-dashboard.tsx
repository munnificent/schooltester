import React from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Tabs, 
  Tab, 
  Divider,
  Avatar,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Badge
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { courses, lessons } from '../data/mock-data';

const TeacherDashboard: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = React.useState<number | null>(null);
  const [uploadStates, setUploadStates] = React.useState<Record<number, { recording: string; homework: File | null }>>(
    {}
  );
  const [isSaving, setIsSaving] = React.useState<Record<number, boolean>>({});
  
  // Initialize upload states for all lessons
  React.useEffect(() => {
    if (selectedCourse !== null) {
      const courseLessons = lessons[selectedCourse] || [];
      const initialState: Record<number, { recording: string; homework: File | null }> = {};
      
      courseLessons.forEach(lesson => {
        initialState[lesson.id] = {
          recording: lesson.recordingUrl || '',
          homework: null
        };
      });
      
      setUploadStates(initialState);
    }
  }, [selectedCourse]);
  
  const handleCourseSelect = (courseId: number) => {
    setSelectedCourse(courseId);
  };
  
  const handleRecordingChange = (lessonId: number, value: string) => {
    setUploadStates(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        recording: value
      }
    }));
  };
  
  const handleHomeworkChange = (lessonId: number, file: File | null) => {
    setUploadStates(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        homework: file
      }
    }));
  };
  
  const handleSaveLesson = (lessonId: number) => {
    setIsSaving(prev => ({
      ...prev,
      [lessonId]: true
    }));
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(prev => ({
        ...prev,
        [lessonId]: false
      }));
      
      // You would typically update the lesson data here
    }, 1000);
  };
  
  const isLessonModified = (lessonId: number) => {
    const lesson = Object.values(lessons).flat().find(l => l.id === lessonId);
    if (!lesson || !uploadStates[lessonId]) return false;
    
    return (
      uploadStates[lessonId].recording !== (lesson.recordingUrl || '') ||
      uploadStates[lessonId].homework !== null
    );
  };
  
  // Mock student data for the selected course
  const mockStudents = [
    {
      id: 1,
      name: "Ескендыр Аманов",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=10",
      email: "eskendyr@example.com",
      phone: "+7 (777) 123-45-67",
      progress: 75,
      lastActivity: "Вчера, 18:30",
      status: "active"
    },
    {
      id: 2,
      name: "Алия Сериккызы",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=11",
      email: "aliya@example.com",
      phone: "+7 (777) 234-56-78",
      progress: 92,
      lastActivity: "Сегодня, 10:15",
      status: "active"
    },
    {
      id: 3,
      name: "Арман Касымов",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=12",
      email: "arman@example.com",
      phone: "+7 (777) 345-67-89",
      progress: 45,
      lastActivity: "3 дня назад",
      status: "inactive"
    },
    {
      id: 4,
      name: "Дина Нурланова",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=13",
      email: "dina@example.com",
      phone: "+7 (777) 456-78-90",
      progress: 68,
      lastActivity: "Сегодня, 09:45",
      status: "active"
    },
    {
      id: 5,
      name: "Бауыржан Темиров",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=14",
      email: "bauka@example.com",
      phone: "+7 (777) 567-89-01",
      progress: 33,
      lastActivity: "Неделю назад",
      status: "inactive"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Кабинет преподавателя</h1>
        <p className="text-foreground-500 mt-2">
          Управление материалами для ваших курсов
        </p>
      </div>
      
      {selectedCourse === null ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Ваши курсы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card isPressable onPress={() => handleCourseSelect(course.id)}>
                  <CardBody className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar src={course.teacher.photoUrl} size="lg" />
                      <div>
                        <h3 className="text-xl font-semibold">{course.name}</h3>
                        <p className="text-foreground-500">Преподаватель: {course.teacher.name}</p>
                      </div>
                    </div>
                    
                    <Divider className="my-4" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:users" width={16} height={16} className="text-foreground-500" />
                        <span className="text-foreground-500">8 учеников</span>
                      </div>
                      
                      <Chip color="primary" variant="flat">
                        {lessons[course.id]?.length || 0} уроков
                      </Chip>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              aria-label="Back to courses"
              onPress={() => setSelectedCourse(null)}
            >
              <Icon icon="lucide:arrow-left" width={20} height={20} />
            </Button>
            <h2 className="text-xl font-semibold">
              {courses.find(c => c.id === selectedCourse)?.name}
            </h2>
          </div>
          
          <Tabs variant="underlined" aria-label="Course tabs">
            <Tab key="lessons" title="Уроки">
              <Card>
                <CardBody className="p-0">
                  <div className="divide-y divide-divider">
                    {(lessons[selectedCourse] || []).map((lesson) => (
                      <div key={lesson.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              lesson.status === 'пройден' 
                                ? 'bg-success/10 text-success' 
                                : 'bg-primary/10 text-primary'
                            }`}>
                              <Icon 
                                icon={lesson.status === 'пройден' ? 'lucide:check' : 'lucide:calendar'} 
                                width={20} 
                                height={20} 
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{lesson.title}</h3>
                              <div className="flex items-center gap-2">
                                <Icon icon="lucide:calendar" width={14} height={14} className="text-foreground-500" />
                                <span className="text-sm text-foreground-500">{lesson.date}</span>
                                <Chip size="sm" color={lesson.status === 'пройден' ? 'success' : 'primary'} variant="flat">
                                  {lesson.status}
                                </Chip>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <Input
                              label="Ссылка на запись урока"
                              placeholder="Вставьте ссылку на запись (Youtube, Google Drive и т.д.)"
                              value={uploadStates[lesson.id]?.recording || ''}
                              onValueChange={(value) => handleRecordingChange(lesson.id, value)}
                              isDisabled={lesson.status !== 'пройден'}
                              startContent={<Icon icon="lucide:video" width={16} height={16} className="text-foreground-500" />}
                            />
                          </div>
                          
                          <div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">Домашнее задание</label>
                              <div className="flex items-center gap-2">
                                <Button
                                  as="label"
                                  htmlFor={`homework-${lesson.id}`}
                                  variant="flat"
                                  color="primary"
                                  startContent={<Icon icon="lucide:upload" width={16} height={16} />}
                                  isDisabled={lesson.status !== 'пройден'}
                                >
                                  {uploadStates[lesson.id]?.homework ? 'Изменить файл' : 'Загрузить файл'}
                                </Button>
                                {uploadStates[lesson.id]?.homework && (
                                  <span className="text-sm text-foreground-500">
                                    {uploadStates[lesson.id].homework.name}
                                  </span>
                                )}
                                <input
                                  type="file"
                                  id={`homework-${lesson.id}`}
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleHomeworkChange(lesson.id, file);
                                  }}
                                  disabled={lesson.status !== 'пройден'}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            color="primary"
                            onPress={() => handleSaveLesson(lesson.id)}
                            isDisabled={lesson.status !== 'пройден' || !isLessonModified(lesson.id)}
                            isLoading={isSaving[lesson.id]}
                          >
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="students" title="Ученики">
              <Card>
                <CardBody className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Список учеников курса</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<Icon icon="lucide:mail" width={16} height={16} />}
                      >
                        Отправить сообщение всем
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Icon icon="lucide:download" width={16} height={16} />}
                      >
                        Экспорт
                      </Button>
                    </div>
                  </div>
                  
                  <Table 
                    removeWrapper
                    aria-label="Список учеников"
                    classNames={{
                      th: "bg-content2 text-foreground-500 font-medium"
                    }}
                  >
                    <TableHeader>
                      <TableColumn>УЧЕНИК</TableColumn>
                      <TableColumn>КОНТАКТЫ</TableColumn>
                      <TableColumn>ПРОГРЕСС</TableColumn>
                      <TableColumn>ПОСЛЕДНЯЯ АКТИВНОСТЬ</TableColumn>
                      <TableColumn>СТАТУС</TableColumn>
                      <TableColumn>ДЕЙСТВИЯ</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {mockStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar src={student.photo} size="sm" />
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{student.email}</span>
                              <span className="text-xs text-foreground-500">{student.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[100px] h-2 bg-content3 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    student.progress >= 75 ? 'bg-success' : 
                                    student.progress >= 50 ? 'bg-primary' : 'bg-warning'
                                  }`}
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{student.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{student.lastActivity}</span>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              size="sm" 
                              color={student.status === 'active' ? 'success' : 'default'}
                              variant="flat"
                            >
                              {student.status === 'active' ? 'Активен' : 'Неактивен'}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                aria-label="Отправить сообщение"
                              >
                                <Icon icon="lucide:message-square" width={16} height={16} />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                aria-label="Просмотреть профиль"
                              >
                                <Icon icon="lucide:user" width={16} height={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </>
      )}
    </motion.div>
  );
};

export default TeacherDashboard;