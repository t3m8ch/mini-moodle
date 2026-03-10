import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Course } from '../../types/course';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Преподаватель:</span>{' '}
            {course.teacherName}
          </p>
          <p className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            {course.studentsCount} студентов
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
