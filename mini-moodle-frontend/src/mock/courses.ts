import type { Course } from '../types/course';

export const courses: Course[] = [
  {
    id: 'course_1',
    title: 'Программирование на Rust',
    description: 'Основы системного программирования и модель владения.',
    teacherName: 'John Smith',
    studentsCount: 42,
  },
  {
    id: 'course_2',
    title: 'Архитектура фронтенда',
    description:
      'Проектирование современных React-приложений с роутингом и паттернами компонентов.',
    teacherName: 'Alice Johnson',
    studentsCount: 31,
  },
  {
    id: 'course_3',
    title: 'Базы данных: базовый курс',
    description:
      'Реляционное моделирование, основы SQL и стратегии индексирования.',
    teacherName: 'Michael Brown',
    studentsCount: 27,
  },
];
