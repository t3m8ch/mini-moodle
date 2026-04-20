export interface Course {
  id: string;
  title: string;
  description: string;
  teacherName: string;
  studentsCount: number;
}

export interface CourseDetail {
  course: Course;
  assignments: import('./assignment').Assignment[];
}
