import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Book, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '../api/apiClient';
import { Course } from '../types';
import { LessonManagementModal } from '../components/admin/modals/LessonManagementModal';

const TeacherCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const fetchTeachingCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Course[]>('/courses/my-teaching/');
      setCourses(response.data);
    } catch (err) {
      setError('Не удалось загрузить курсы.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachingCourses();
  }, []);

  const handleManageLessons = (course: Course) => {
    setSelectedCourse(course);
    setIsLessonModalOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  if (error) {
    return (
        <div className="text-center py-10 bg-muted rounded-md">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <p className="mt-4 font-medium text-destructive">{error}</p>
            <button onClick={fetchTeachingCourses} className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
                Попробовать снова
            </button>
        </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Мои курсы</h1>
      </header>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-card border rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    <Book className="h-6 w-6 text-primary"/>
                    <h2 className="text-xl font-semibold truncate">{course.title}</h2>
                </div>
                <p className="text-muted-foreground h-20 overflow-hidden text-ellipsis">{course.description}</p>
              </div>
              <div className="px-6 pb-6 pt-4 bg-muted/50">
                 <button 
                    onClick={() => handleManageLessons(course)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus size={16} /> Управлять уроками
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Book className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">У вас пока нет курсов</h3>
            <p className="mt-2 text-sm text-muted-foreground">Здесь будут отображаться курсы, которые вы ведете.</p>
        </div>
      )}

      {selectedCourse && (
        <LessonManagementModal 
            courseId={selectedCourse.id}
            isOpen={isLessonModalOpen}
            onClose={() => setIsLessonModalOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default TeacherCoursesPage;
