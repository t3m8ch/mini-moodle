import type { Assignment } from '../types/assignment';

export const assignments: Assignment[] = [
  {
    id: 'assignment_1',
    title: 'Практика по владению',
    description:
      'Реализуйте небольшое CLI-приложение, демонстрирующее правила заимствования.',
    deadline: '2026-03-20',
    courseId: 'course_1',
    status: 'in_progress',
  },
  {
    id: 'assignment_2',
    title: 'Лабораторная по роутингу React',
    description:
      'Создайте вложенные маршруты с общим макетом и защитой переходов.',
    deadline: '2026-03-25',
    courseId: 'course_2',
    status: 'not_started',
  },
  {
    id: 'assignment_3',
    title: 'Практикум по SQL',
    description:
      'Напишите запросы с объединениями, агрегированием и фильтрацией по дате.',
    deadline: '2026-03-28',
    courseId: 'course_3',
    status: 'submitted',
  },
  {
    id: 'assignment_4',
    title: 'Заметки по безопасности памяти',
    description: 'Подготовьте краткий отчёт о безопасных абстракциях в Rust.',
    deadline: '2026-03-14',
    courseId: 'course_1',
    status: 'graded',
  },
];
