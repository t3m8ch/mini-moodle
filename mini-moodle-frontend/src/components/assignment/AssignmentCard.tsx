import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assignmentStatusMap } from '../../lib/assignmentStatus';
import type { Assignment } from '../../types/assignment';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const status = assignmentStatusMap[assignment.status];

  return (
    <Link className="block" to={`/assignments/${assignment.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription>{assignment.description}</CardDescription>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-600">
            Курс: {assignment.courseTitle}
          </p>
          <p className="inline-flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4" />
            Срок: {assignment.deadline}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
