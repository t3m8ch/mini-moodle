import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const statusMap: Record<
  Assignment['status'],
  { label: string; variant: 'secondary' | 'warning' | 'default' | 'success' }
> = {
  not_started: { label: 'Не начато', variant: 'secondary' },
  in_progress: { label: 'В процессе', variant: 'warning' },
  submitted: { label: 'Отправлено', variant: 'default' },
  graded: { label: 'Проверено', variant: 'success' },
};

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const status = statusMap[assignment.status];

  return (
    <Link to={`/assignments/${assignment.id}`} className="block">
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
        <CardContent>
          <p className="inline-flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4" />
            Срок: {assignment.deadline}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
