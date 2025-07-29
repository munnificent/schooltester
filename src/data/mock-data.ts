import { Teacher, Review, UpcomingLesson, Course, Lesson, TestQuestion } from '../types';

// Teachers mock data
export const teachers: Teacher[] = [
  {
    id: 1,
    name: 'Айгерим Н.',
    photoUrl: 'https://img.heroui.chat/image/avatar?w=500&h=500&u=1',
    subjects: ['Математика', 'Физика'],
    description: 'Сдала ЕНТ по математике на 38 баллов. Верит, что даже гуманитарий может понять логарифмы, если объяснить их на примере пиццы.'
  },
  {
    id: 2,
    name: 'Данияр С.',
    photoUrl: 'https://img.heroui.chat/image/avatar?w=500&h=500&u=2',
    subjects: ['Физика', 'Информатика'],
    description: 'Участник международных олимпиад по физике. Объясняет квантовую механику через мемы и видеоигры.'
  },
  {
    id: 3,
    name: 'Алия К.',
    photoUrl: 'https://img.heroui.chat/image/avatar?w=500&h=500&u=3',
    subjects: ['Казахский язык', 'Литература'],
    description: 'Магистр филологии с 5-летним опытом подготовки к ЕНТ. Знает все литературные приемы казахских акынов.'
  },
  {
    id: 4,
    name: 'Арман Т.',
    photoUrl: 'https://img.heroui.chat/image/avatar?w=500&h=500&u=4',
    subjects: ['История', 'География'],
    description: 'Историк со страстью к путешествиям. Помогает запоминать даты через ассоциации с современными событиями.'
  }
];

// Reviews mock data
export const reviews: Review[] = [
  {
    id: 1,
    author: 'Алан, 11 класс',
    text: 'Думал, физика — это не мое, но с Данияром всё стало понятно! Теперь это мой любимый предмет.',
    scoreInfo: 'Сдал ЕНТ по физике на 35 баллов'
  },
  {
    id: 2,
    author: 'Дина, 9 класс',
    text: 'Благодаря занятиям с Алией я наконец-то полюбила казахскую литературу. Она рассказывает так интересно, что я запоминаю всё с первого раза!',
    scoreInfo: 'Средний балл вырос с 3 до 5'
  },
  {
    id: 3,
    author: 'Ержан, 11 класс',
    text: 'За три месяца занятий мой уровень в математике вырос настолько, что родители не поверили, что я сам решил контрольную. Спасибо Айгерим!',
    scoreInfo: 'Сдал ЕНТ по математике на 37 баллов'
  }
];

// Upcoming lessons mock data
export const upcomingLessons: UpcomingLesson[] = [
  {
    id: 1,
    courseName: 'Математика (ЕНТ)',
    teacherName: 'Айгерим Н.',
    date: 'Сегодня',
    time: '18:00',
    zoomLink: 'https://zoom.us/j/123456789'
  },
  {
    id: 2,
    courseName: 'Физика',
    teacherName: 'Данияр С.',
    date: 'Завтра',
    time: '16:30',
    zoomLink: 'https://zoom.us/j/987654321'
  },
  {
    id: 3,
    courseName: 'Казахский язык',
    teacherName: 'Алия К.',
    date: '29 Сентября',
    time: '15:00',
    zoomLink: 'https://zoom.us/j/567891234'
  }
];

// Courses mock data
export const courses: Course[] = [
  {
    id: 1,
    name: 'Математика (ЕНТ)',
    teacher: {
      name: 'Айгерим Н.',
      photoUrl: 'https://img.heroui.chat/image/avatar?w=500&h=500&u=1'
    },
    progress: 75
  },
  {
    id: 2,
    name: 'Физика, 10 класс',
    teacher: {
      name: 'Данияр С.',
      photoUrl: 'https://img.heroui.chat/image/avatar?w=500&h=500&u=2'
    },
    progress: 40
  },
  {
    id: 3,
    name: 'Казахский язык',
    teacher: {
      name: 'Алия К.',
      photoUrl: 'https://img.heroui.chat/image/avatar?w=500&h=500&u=3'
    },
    progress: 60
  }
];

// Lessons mock data
export const lessons: Record<number, Lesson[]> = {
  1: [
    {
      id: 101,
      title: 'Линейные уравнения и неравенства',
      date: '10.09.2023',
      status: 'пройден',
      recordingUrl: 'https://example.com/recording101',
      homeworkUrl: 'https://example.com/homework101'
    },
    {
      id: 102,
      title: 'Квадратные уравнения и теорема Виета',
      date: '17.09.2023',
      status: 'пройден',
      recordingUrl: 'https://example.com/recording102',
      homeworkUrl: 'https://example.com/homework102'
    },
    {
      id: 103,
      title: 'Функции и их свойства',
      date: '24.09.2023',
      status: 'пройден',
      recordingUrl: 'https://example.com/recording103',
      homeworkUrl: 'https://example.com/homework103'
    },
    {
      id: 104,
      title: 'Тригонометрические функции',
      date: '01.10.2023',
      status: 'предстоит'
    },
    {
      id: 105,
      title: 'Производные и их применение',
      date: '08.10.2023',
      status: 'предстоит'
    }
  ],
  2: [
    {
      id: 201,
      title: 'Кинематика',
      date: '12.09.2023',
      status: 'пройден',
      recordingUrl: 'https://example.com/recording201',
      homeworkUrl: 'https://example.com/homework201'
    },
    {
      id: 202,
      title: 'Динамика',
      date: '19.09.2023',
      status: 'пройден',
      recordingUrl: 'https://example.com/recording202',
      homeworkUrl: 'https://example.com/homework202'
    },
    {
      id: 203,
      title: 'Законы сохранения в механике',
      date: '26.09.2023',
      status: 'предстоит'
    },
    {
      id: 204,
      title: 'Механические колебания и волны',
      date: '03.10.2023',
      status: 'предстоит'
    }
  ],
  3: [
    {
      id: 301,
      title: 'Фонетика казахского языка',
      date: '11.09.2023',
      status: 'пройден',
      recordingUrl: 'https://example.com/recording301',
      homeworkUrl: 'https://example.com/homework301'
    },
    {
      id: 302,
      title: 'Лексика и фразеология',
      date: '18.09.2023',
      status: 'пройден',
      recordingUrl: 'https://example.com/recording302',
      homeworkUrl: 'https://example.com/homework302'
    },
    {
      id: 303,
      title: 'Морфология. Части речи',
      date: '25.09.2023',
      status: 'пройден',
      recordingUrl: 'https://example.com/recording303',
      homeworkUrl: 'https://example.com/homework303'
    },
    {
      id: 304,
      title: 'Синтаксис простого предложения',
      date: '02.10.2023',
      status: 'предстоит'
    },
    {
      id: 305,
      title: 'Синтаксис сложного предложения',
      date: '09.10.2023',
      status: 'предстоит'
    }
  ]
};

// Test questions mock data
export const testQuestions: Record<string, TestQuestion[]> = {
  'Математика': [
    {
      id: 1001,
      question: 'Решите уравнение: 2x + 5 = 15',
      options: ['x = 5', 'x = 10', 'x = -5', 'x = 7'],
      correctOptionIndex: 0
    },
    {
      id: 1002,
      question: 'Вычислите значение выражения: 3^2 + 4^2',
      options: ['7', '25', '16', '5'],
      correctOptionIndex: 1
    },
    {
      id: 1003,
      question: 'Найдите производную функции f(x) = x^2 + 3x',
      options: ['f\'(x) = 2x + 3', 'f\'(x) = x^2', 'f\'(x) = 2x', 'f\'(x) = 3'],
      correctOptionIndex: 0
    },
    {
      id: 1004,
      question: 'Чему равно sin(π/4)?',
      options: ['1/2', '√2/2', '√3/2', '0'],
      correctOptionIndex: 1
    },
    {
      id: 1005,
      question: 'Решите неравенство: 2x - 3 > 7',
      options: ['x > 5', 'x > 4', 'x < 5', 'x < 2'],
      correctOptionIndex: 0
    }
  ],
  'Физика': [
    {
      id: 2001,
      question: 'Чему равно ускорение свободного падения на Земле?',
      options: ['9.8 м/с²', '6.7 м/с²', '10 м/с²', '8.9 м/с²'],
      correctOptionIndex: 0
    },
    {
      id: 2002,
      question: 'По какой формуле можно рассчитать силу тока?',
      options: ['I = U/R', 'I = U·R', 'I = R/U', 'I = P/U'],
      correctOptionIndex: 0
    },
    {
      id: 2003,
      question: 'Какой закон описывает связь между давлением и объемом газа при постоянной температуре?',
      options: ['Закон Ома', 'Закон Гука', 'Закон Бойля-Мариотта', 'Закон Архимеда'],
      correctOptionIndex: 2
    },
    {
      id: 2004,
      question: 'Какая формула выражает второй закон Ньютона?',
      options: ['F = ma', 'E = mc²', 'F = G·(m₁·m₂)/r²', 'P = F/S'],
      correctOptionIndex: 0
    },
    {
      id: 2005,
      question: 'Какое явление описывает закон Кулона?',
      options: ['Гравитационное взаимодействие', 'Электромагнитную индукцию', 'Электростатическое взаимодействие', 'Интерференцию света'],
      correctOptionIndex: 2
    }
  ]
};

// Student name for dashboard
export const studentName = 'Ескендыр';

// Class options for calculator
export const classOptions = ['5 класс', '6 класс', '7 класс', '8 класс', '9 класс', '10 класс', '11 класс'];

// Subject options for calculator
export const subjectOptions = ['Математика', 'Физика', 'Химия', 'Биология', 'История', 'География', 'Казахский язык', 'Русский язык', 'Английский язык'];

// Lesson count options for calculator
export const lessonCountOptions = [4, 8, 12];
