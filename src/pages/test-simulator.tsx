import React, { useEffect, useReducer, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Предполагаем, что у нас есть apiClient для запросов
// import apiClient from'../api/apiClient'; 

// --- Типы ---
// TODO: Перенести в /types/index.ts, если будут переиспользоваться
interface TestQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

interface TestDetails {
  id: number;
  title: string;
  courseTitle: string;
  questions: TestQuestion[];
}

type Screen = 'loading' | 'test' | 'results' | 'error';

interface State {
  screen: Screen;
  testDetails: TestDetails | null;
  currentIndex: number;
  answers: Record<number, number>; // { questionId: answerIndex }
  result: { correct: number; total: number };
  error: string | null;
}

type Action =
  | { type: 'FETCH_SUCCESS'; payload: TestDetails }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ANSWER'; payload: { questionId: number; answerIndex: number } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH_TEST' }
  | { type: 'RESTART' };


// --- Редьюсер для управления состоянием ---
const initialState: State = {
  screen: 'loading',
  testDetails: null,
  currentIndex: 0,
  answers: {},
  result: { correct: 0, total: 0 },
  error: null,
};

function testReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...initialState, screen: 'test', testDetails: action.payload };
    case 'FETCH_ERROR':
      return { ...initialState, screen: 'error', error: action.payload };
    case 'ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.payload.questionId]: action.payload.answerIndex },
      };
    case 'NEXT_QUESTION':
      if (state.testDetails && state.currentIndex < state.testDetails.questions.length - 1) {
        return { ...state, currentIndex: state.currentIndex + 1 };
      }
      return state;
    case 'FINISH_TEST': {
      if (!state.testDetails) return state;
      let correctCount = 0;
      state.testDetails.questions.forEach((q) => {
        if (state.answers[q.id] === q.correctOptionIndex) {
          correctCount++;
        }
      });
      return {
        ...state,
        screen: 'results',
        result: { correct: correctCount, total: state.testDetails.questions.length },
      };
    }
    case 'RESTART':
      return { ...initialState, screen: 'loading' }; // Перезапускаем с загрузки
    default:
      return state;
  }
}

// --- Компоненты UI (для примера внутри файла) ---
const UiCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-card text-card-foreground rounded-xl border shadow-sm ${className}`}>{children}</div>
);

// --- Основные компоненты экранов ---

const LoadingScreen: React.FC = () => (
    <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-muted rounded w-full mb-8"></div>
        <UiCard className="p-6">
            <div className="h-6 bg-muted rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
            </div>
        </UiCard>
    </div>
);

const ErrorScreen: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="text-center py-10">
    <XCircle className="mx-auto h-12 w-12 text-destructive" />
    <h2 className="mt-4 text-xl font-semibold">Не удалось загрузить тест</h2>
    <p className="mt-2 text-muted-foreground">{message}</p>
    <button onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      <RotateCcw className="h-4 w-4" />
      Попробовать снова
    </button>
  </div>
);

const TestScreen: React.FC<{ state: State; dispatch: React.Dispatch<Action> }> = ({ state, dispatch }) => {
  const { testDetails, currentIndex, answers } = state;
  if (!testDetails) return null;

  const currentQuestion = testDetails.questions[currentIndex];
  const isLastQuestion = currentIndex === testDetails.questions.length - 1;
  const progress = ((currentIndex + 1) / testDetails.questions.length) * 100;

  const handleNext = () => {
    if (isLastQuestion) {
      dispatch({ type: 'FINISH_TEST' });
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{testDetails.courseTitle}</h1>
        <p className="text-muted-foreground">{testDetails.title}</p>
      </header>

      <div className="w-full bg-muted rounded-full h-2 mb-8">
        <motion.div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <UiCard>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <p className="mb-1 text-sm font-medium text-primary">
              Вопрос {currentIndex + 1} из {testDetails.questions.length}
            </p>
            <h2 className="text-lg font-semibold mb-6">{currentQuestion.questionText}</h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === index ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => dispatch({ type: 'ANSWER', payload: { questionId: currentQuestion.id, answerIndex: index } })}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </UiCard>
    </div>
  );
};

const ResultsScreen: React.FC<{ state: State; dispatch: React.Dispatch<Action> }> = ({ state, dispatch }) => {
    const { result, testDetails } = state;
    const navigate = useNavigate();
    const percentage = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
    
    const getResultInfo = (p: number) => {
        if (p >= 80) return { message: 'Отличный результат!', color: 'text-success' };
        if (p >= 60) return { message: 'Хороший результат!', color: 'text-primary' };
        if (p >= 40) return { message: 'Можно и лучше', color: 'text-amber-500' };
        return { message: 'Стоит подучить материал', color: 'text-destructive' };
    };

    const info = getResultInfo(percentage);

    return (
        <div className="max-w-md mx-auto">
            <UiCard className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                    {percentage >= 60 ? <CheckCircle2 className={`mx-auto h-16 w-16 ${info.color}`} /> : <XCircle className={`mx-auto h-16 w-16 ${info.color}`} />}
                </motion.div>
                <h1 className="mt-4 text-2xl font-bold">Тест завершен!</h1>
                <p className={`mt-2 text-lg font-medium ${info.color}`}>{info.message}</p>
                
                <div className="my-6">
                    <p className="text-4xl font-bold">{result.correct} <span className="text-xl text-muted-foreground">/ {result.total}</span></p>
                    <p className="text-muted-foreground">правильных ответов</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                     <button onClick={() => navigate('/my-courses')} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80">
                        К моим курсам
                    </button>
                    <button onClick={() => dispatch({ type: 'RESTART' })} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <RotateCcw className="h-4 w-4" />
                        Пройти еще раз
                    </button>
                </div>
            </UiCard>
        </div>
    );
};


// --- Основной компонент-контейнер ---
const TestSimulatorPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [state, dispatch] = useReducer(testReducer, initialState);

  const fetchTest = useCallback(async () => {
    if (!courseId) {
      dispatch({ type: 'FETCH_ERROR', payload: 'ID курса не найден в URL.' });
      return;
    }
    
    try {
      // --- ЗАГЛУШКА ДЛЯ API ---
      // В реальном приложении здесь будет запрос к API
      // const response = await apiClient.get(`/api/courses/${courseId}/test`);
      // dispatch({ type: 'FETCH_SUCCESS', payload: response.data });

      // --- Имитация ответа API ---
      console.log(`Загрузка теста для курса ID: ${courseId}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки сети
      
      const mockApiResponse: TestDetails = {
        id: 1,
        title: "Итоговый тест",
        courseTitle: "Математическая грамотность",
        questions: [
            { id: 101, questionText: "Чему равно 2 + 2 * 2?", options: ["6", "8", "4", "10"], correctOptionIndex: 0 },
            { id: 102, questionText: "Столица Казахстана?", options: ["Алматы", "Астана", "Караганда", "Шымкент"], correctOptionIndex: 1 },
            { id: 103, questionText: "Сколько будет (5 + 3) / 2?", options: ["3", "4", "5", "6"], correctOptionIndex: 1 },
        ]
      };
      
      dispatch({ type: 'FETCH_SUCCESS', payload: mockApiResponse });
      toast.success('Тест успешно загружен!');

    } catch (error) {
      console.error("Ошибка при загрузке теста:", error);
      toast.error('Не удалось загрузить тест.');
      dispatch({ type: 'FETCH_ERROR', payload: 'Произошла ошибка при запросе к серверу.' });
    }
  }, [courseId]);

  useEffect(() => {
    if (state.screen === 'loading') {
      fetchTest();
    }
  }, [state.screen, fetchTest]);

  const renderScreen = () => {
    switch (state.screen) {
      case 'loading': return <LoadingScreen />;
      case 'test': return <TestScreen state={state} dispatch={dispatch} />;
      case 'results': return <ResultsScreen state={state} dispatch={dispatch} />;
      case 'error': return <ErrorScreen message={state.error!} onRetry={() => dispatch({ type: 'RESTART' })} />;
      default: return null;
    }
  };

  return <div className="container mx-auto px-4 py-8">{renderScreen()}</div>;
};

export default TestSimulatorPage;