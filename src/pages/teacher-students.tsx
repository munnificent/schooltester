import React from 'react';
import { 
  Card, 
  CardBody, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Input,
  Button,
  Avatar,
  Tabs,
  Tab,
  Divider
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const TeacherStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Mock student data for teacher view
  const students = [
    {
      id: 1,
      name: "Ескендыр Аманов",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=10",
      email: "eskendyr@example.com",
      phone: "+7 (777) 123-45-67",
      progress: 75,
      lastActivity: "Вчера, 18:30",
      status: "active",
      subjects: ["Математика", "Физика"]
    },
    {
      id: 2,
      name: "Алия Сериккызы",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=11",
      email: "aliya@example.com",
      phone: "+7 (777) 234-56-78",
      progress: 92,
      lastActivity: "Сегодня, 10:15",
      status: "active",
      subjects: ["Математика"]
    },
    {
      id: 3,
      name: "Арман Касымов",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=12",
      email: "arman@example.com",
      phone: "+7 (777) 345-67-89",
      progress: 45,
      lastActivity: "3 дня назад",
      status: "inactive",
      subjects: ["Физика"]
    },
    {
      id: 4,
      name: "Дина Нурланова",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=13",
      email: "dina@example.com",
      phone: "+7 (777) 456-78-90",
      progress: 68,
      lastActivity: "Сегодня, 09:45",
      status: "active",
      subjects: ["Математика", "Физика"]
    },
    {
      id: 5,
      name: "Бауыржан Темиров",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=14",
      email: "bauka@example.com",
      phone: "+7 (777) 567-89-01",
      progress: 33,
      lastActivity: "Неделю назад",
      status: "inactive",
      subjects: ["Физика"]
    }
  ];

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.subjects.some(subj => subj.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper function for status display
  const getStatusChip = (status: string) => {
    let color = "default";
    let label = "";
    
    switch(status) {
      case "active":
        color = "success";
        label = "Активен";
        break;
      case "inactive":
        color = "default";
        label = "Неактивен";
        break;
    }
    
    return (
      <Chip color={color as any} variant="flat" size="sm">
        {label}
      </Chip>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Мои ученики</h1>
        <p className="text-foreground-500 mt-2">
          Управление учениками и их прогрессом
        </p>
      </div>
      
      <Card>
        <CardBody className="p-0">
          <Tabs variant="underlined" aria-label="Student tabs">
            <Tab key="all" title="Все ученики">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск учеников..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
                      clearable
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button color="primary" startContent={<Icon icon="lucide:mail" width={16} height={16} />}>
                      Отправить сообщение всем
                    </Button>
                  </div>
                </div>
                
                <Table aria-label="Таблица учеников" removeWrapper>
                  <TableHeader>
                    <TableColumn>УЧЕНИК</TableColumn>
                    <TableColumn>КОНТАКТЫ</TableColumn>
                    <TableColumn>ПРЕДМЕТЫ</TableColumn>
                    <TableColumn>ПРОГРЕСС</TableColumn>
                    <TableColumn>ПОСЛЕДНЯЯ АКТИВНОСТЬ</TableColumn>
                    <TableColumn>СТАТУС</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Ученики не найдены">
                    {filteredStudents.map((student) => (
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
                          <div className="flex flex-wrap gap-1">
                            {student.subjects.map((subject, idx) => (
                              <Chip key={idx} size="sm" variant="flat" color="primary">
                                {subject}
                              </Chip>
                            ))}
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
                        <TableCell>{getStatusChip(student.status)}</TableCell>
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
              </div>
            </Tab>
            
            <Tab key="active" title="Активные">
              <div className="p-6">
                <Table aria-label="Таблица активных учеников" removeWrapper>
                  <TableHeader>
                    <TableColumn>УЧЕНИК</TableColumn>
                    <TableColumn>ПРЕДМЕТЫ</TableColumn>
                    <TableColumn>ПРОГРЕСС</TableColumn>
                    <TableColumn>ПОСЛЕДНЯЯ АКТИВНОСТЬ</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Активные ученики не найдены">
                    {students
                      .filter(student => student.status === 'active')
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar src={student.photo} size="sm" />
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {student.subjects.map((subject, idx) => (
                                <Chip key={idx} size="sm" variant="flat" color="primary">
                                  {subject}
                                </Chip>
                              ))}
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
              </div>
            </Tab>
            
            <Tab key="inactive" title="Неактивные">
              <div className="p-6">
                <Table aria-label="Таблица неактивных учеников" removeWrapper>
                  <TableHeader>
                    <TableColumn>УЧЕНИК</TableColumn>
                    <TableColumn>ПРЕДМЕТЫ</TableColumn>
                    <TableColumn>ПРОГРЕСС</TableColumn>
                    <TableColumn>ПОСЛЕДНЯЯ АКТИВНОСТЬ</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Неактивные ученики не найдены">
                    {students
                      .filter(student => student.status === 'inactive')
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar src={student.photo} size="sm" />
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {student.subjects.map((subject, idx) => (
                                <Chip key={idx} size="sm" variant="flat" color="primary">
                                  {subject}
                                </Chip>
                              ))}
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
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default TeacherStudents;